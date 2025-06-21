import { EmailService } from '$email/email.service';
import { I18nException } from '$i18n/i18n.error';
import { fallbackLanguage } from '$i18n/i18n.module';
import { TypedI18nService } from '$i18n/i18n.service';
import { User } from '$prisma-client';
import { PrismaService } from '$prisma/prisma.service';
import { SocketService } from '$socket/socket.service';
import { PresenceService } from '$users/presence/presence.service';
import { generateId, generateRandomSafeString } from '$utils/random';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { wsR } from '~contract';
import { AuthError } from './auth.error';
import { Auth, LuciaFactory } from './lucia/lucia.factory';
import { loadOsloPasswordModule } from './lucia/modules-compat';
import { LuciaSession, LuciaUser } from './session.decorator';

export type CreateUserLuciaAttributes = Partial<Omit<LuciaUser, 'email'>>;

@Injectable()
export class AuthService {
	constructor(
		@Inject(LuciaFactory) private readonly auth: Auth,
		private readonly prisma: PrismaService,
		private readonly email: EmailService,
		private readonly i18n: TypedI18nService,
		private readonly sockets: SocketService,
		private readonly presenceService: PresenceService,
	) {}

	async hashPassword(password: string) {
		const { Argon2id } = await loadOsloPasswordModule();

		return new Argon2id().hash(password);
	}

	async verifyPassword(hashedPassword: string, password: string) {
		const { Argon2id } = await loadOsloPasswordModule();

		return new Argon2id().verify(hashedPassword, password);
	}

	async getLuciaUser(userId: string) {
		return this.prisma.user.findUniqueOrThrow({
			where: {
				id: userId,
			},
		});
	}

	async getAuthUser(email: string) {
		// const { online, selector } = this.prisma.extractSelectors<UserOnlineSelector>(select, 'online');

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

	async createUser(email: string, password: string | null, attributes?: CreateUserLuciaAttributes) {
		const userExists = await this.prisma.user.exists({ email });

		if (userExists) {
			throw new BadRequestException(this.i18n.t('auth.errors.email.exists'));
		}

		const id = await generateId();

		const registerToken = password ? null : await generateRandomSafeString();

		const hashedPassword = password ? await this.hashPassword(password) : undefined;

		const user = await this.prisma.user.create({
			data: {
				id,
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

	async register(registerToken: string, password: string, attributes: CreateUserLuciaAttributes) {
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
		const session = await this.auth.createSession(userId, {});
		const sessionCookie = this.auth.createSessionCookie(session.id);

		return { session, sessionCookie };
	}

	async logout(session: LuciaSession) {
		await this.auth.invalidateSession(session.id);

		return this.auth.createBlankSessionCookie();
	}

	async getForgotPasswordRequestToken() {
		const forgotPasswordToken = generateRandomSafeString();

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
				token: {
					equals: token,
				},
				expiryDate: {
					gt: currentDate,
				},
				used: {
					equals: false,
				},
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
			url: `${origin.url}/forgot_password?resetToken=${token}`,
			i18nLang: lang,
		};

		return this.email.renderAndSend(['./emails/ForgotPasswordRequest.hbs', templateData], {
			to: { email: user.email, name: userFullName },
			subject: this.i18n.t('auth.emails.forgot_password_request.subject', { lang }),
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

			await this.auth.invalidateUserSessions(user.id);
		} catch (_error) {
			// eh
		}

		return { user };
	}

	async updatePassword(user: LuciaUser, password: string) {
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
