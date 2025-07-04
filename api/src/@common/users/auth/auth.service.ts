import { CryptoService } from '$crypto/crypto.service';
import { EmailService } from '$email/email.service';
import { I18nException } from '$i18n/i18n.error';
import { fallbackLanguage } from '$i18n/i18n.module';
import { TypedI18nService } from '$i18n/i18n.service';
import { Session, User } from '$prisma-client';
import { PrismaService } from '$prisma/prisma.service';
import { SocketService } from '$socket/socket.service';
import { PresenceService } from '$users/presence/presence.service';
import { msDays } from '$utils/time';
import { BadRequestException, Injectable } from '@nestjs/common';
import { hash, verify } from '@node-rs/argon2';
import { wsR } from '~contract';
import { AuthError } from './auth.error';
import { AppUser } from './session/session.decorator';
import { SessionService } from './session/session.service';

export type CreateAppUserAttributes = Partial<Omit<AppUser, 'email' | 'hashedPassword'>>;

@Injectable()
export class AuthService {
	constructor(
		private readonly sessionService: SessionService,
		private readonly prisma: PrismaService,
		private readonly email: EmailService,
		private readonly i18n: TypedI18nService,
		private readonly sockets: SocketService,
		private readonly presenceService: PresenceService,
		private readonly cryptoService: CryptoService,
	) {}

	async hashPassword(password: string) {
		return hash(password);
	}

	async verifyPassword(hashedPassword: string, password: string) {
		return verify(hashedPassword, password);
	}

	async getAppUser(userId: string) {
		return this.prisma.user.findUniqueOrThrow({
			where: {
				id: userId,
			},
		});
	}

	async getAuthUser(email: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				email,
			},
			include: {
				roles: true,
			},
		});

		return user;
	}

	async getUnregisteredUser(registerToken: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				registerToken,
			},
			select: {
				email: true,
				firstName: true,
				lastName: true,
			},
		});

		if (!user) {
			throw new Error(this.i18n.t('auth.errors.registration.invalid'));
		}

		return user;
	}

	async createUser(email: string, password: string | null, attributes?: CreateAppUserAttributes) {
		const userExists = await this.prisma.user.exists({ email });

		if (userExists) {
			throw new BadRequestException(this.i18n.t('auth.errors.email.exists'));
		}

		const registerToken = password ? null : this.cryptoService.generateRandomSafeString();

		const hashedPassword = password ? await this.hashPassword(password) : undefined;

		const user = await this.prisma.user.create({
			data: {
				email,
				hashedPassword,
				registerToken,
				emailLang: attributes?.emailLang ?? fallbackLanguage,
				firstName: attributes?.firstName ?? null,
				lastName: attributes?.lastName ?? null,
				profilePictureRef: attributes?.profilePictureRef ?? null,
				lang: attributes?.lang ?? null,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		});

		return user;
	}

	async register(registerToken: string, password: string, attributes: CreateAppUserAttributes) {
		const user = await this.prisma.user.findFirst({
			where: {
				registerToken,
			},
			select: {
				id: true,
				email: true,
			},
		});

		if (!user) {
			throw new Error(this.i18n.t('auth.errors.registration.invalid'));
		}

		const hashedPassword = await this.hashPassword(password);

		const updatedUser = await this.prisma.user.update({
			data: {
				...attributes,
				registerToken: null,
				hashedPassword,
			},
			where: {
				id: user.id,
			},
			include: {
				roles: true,
			},
		});

		this.sockets.emit(wsR.users.edited, this.presenceService.convertUserToLiveUser(updatedUser));

		return this.loginUser(updatedUser.id);
	}

	async login(email: string, password: string) {
		const user = await this.prisma.$rawClient.user.findUnique({
			where: {
				email,
			},
			select: {
				id: true,
				hashedPassword: true,
			},
		});

		if (!user) {
			throw new AuthError();
		}

		const validPassword = await this.verifyPassword(user.hashedPassword ?? '', password);

		if (!validPassword) {
			throw new AuthError();
		}

		return this.loginUser(user.id);
	}

	async loginUser(userId: string) {
		const session = await this.sessionService.createSession(userId);

		const sessionCookie = this.sessionService.createSessionCookie(session.token);

		return { session, sessionCookie };
	}

	async logout(session: Session) {
		await this.sessionService.deleteSession(session.id);

		return this.sessionService.createBlankSessionCookie();
	}

	getForgotPasswordRequestToken() {
		const forgotPasswordToken = this.cryptoService.generateRandomSafeString();

		return forgotPasswordToken;
	}

	protected createPasswordResetExpiryDate(maxTimeInMinutes = 15) {
		const expiryDate = new Date();

		expiryDate.setMinutes(expiryDate.getMinutes() + maxTimeInMinutes);

		return expiryDate;
	}

	async getPasswordResetAttempt(token: string) {
		const currentDate = new Date();

		const passwordAttempt = await this.prisma.passwordResetAttempt.findFirst({
			where: {
				token,
				expiryDate: {
					gt: currentDate,
				},
				used: false,
			},
			select: {
				id: true,
				user: true,
			},
		});

		if (passwordAttempt) {
			// extend attempt(s) expiry date to give time for password update
			await this.prisma.passwordResetAttempt.updateMany({
				where: {
					id: {
						equals: passwordAttempt.id,
					},
				},
				data: {
					expiryDate: this.createPasswordResetExpiryDate(),
				},
			});
		}

		return passwordAttempt;
	}

	async sendPasswordResetRequestEmail(email: string, token: string, origin: { url: string }) {
		const attemptsInTheLastDay = await this.prisma.passwordResetAttempt.count({
			where: {
				user: {
					email,
				},
				createdAt: {
					gt: new Date(Date.now() - msDays(1)),
				},
			},
		});

		if (attemptsInTheLastDay > 15) {
			// Prevent too many attempts, across IPs
			// No error thrown here as it might leak existing user emails
			return;
		}

		const { user } = await this.prisma.passwordResetAttempt
			.create({
				data: {
					user: {
						connect: {
							email,
						},
					},
					token,
					expiryDate: this.createPasswordResetExpiryDate(),
				},
				select: {
					user: true,
				},
			})
			.catch(() => {
				return { user: null };
			});

		if (!user) {
			return;
		}

		const lang = user.emailLang;

		const userFullName = `${user.firstName} ${user.lastName}`;

		const templateData = {
			url: `${origin.url}/forgot-password?resetToken=${token}`,
			i18nLang: lang,
		};

		return this.email.renderAndSend(['./emails/ForgotPasswordRequest.hbs', templateData], {
			to: { email: user.email, name: userFullName },
			subject: this.i18n.t('auth.emails.forgot-password_request.subject', { lang }),
		});
	}

	async resetPassword(token: string, password: string) {
		const pswResetAttempt = await this.getPasswordResetAttempt(token);

		if (pswResetAttempt === null) {
			throw new I18nException('auth.errors.password.reset.no-attempt-found');
		}

		const { user, id } = pswResetAttempt;

		try {
			await this.prisma.$transaction(async (tx) => {
				const { user } = await tx.passwordResetAttempt.update({
					data: {
						used: {
							set: true,
						},
					},
					where: {
						id,
					},
					select: {
						user: {
							select: {
								id: true,
							},
						},
					},
				});

				const hashedPassword = await this.hashPassword(password);

				await tx.user.update({
					data: {
						hashedPassword,
					},
					where: {
						id: user.id,
					},
				});
			});

			await this.sessionService.invalidateUserSessions(user.id);
		} catch (_error) {
			// eh
		}

		return { user };
	}

	async updatePassword(user: AppUser, password: string) {
		const hashedPassword = await this.hashPassword(password);

		await this.prisma.user.update({
			data: {
				hashedPassword,
			},
			where: {
				id: user.id,
			},
		});
	}

	async sendPasswordResetSuccessEmail(user: User, _origin: { url: string }) {
		const lang = user.emailLang;

		const userFullName = `${user.firstName} ${user.lastName}`;

		const templateData = {
			i18nLang: lang,
		};

		// TODO: Add website origin in email

		return this.email.renderAndSend(['./emails/PasswordResetSuccessful.hbs', templateData], {
			to: { email: user.email, name: userFullName },
			subject: this.i18n.t('auth.emails.password_reset.subject', { lang }),
		});
	}
}
