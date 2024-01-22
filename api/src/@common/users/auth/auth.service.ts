import { EmailService } from '$email/email.service';
import { I18nException } from '$i18n/i18n.error';
import { fallbackLanguage } from '$i18n/i18n.module';
import { TypedI18nService } from '$i18n/i18n.service';
import { User } from '$prisma-client';
import { PrismaSelector, PrismaService, PrismaSubscribeTriggers } from '$prisma/prisma.service';
import { loadLuciaUtils } from '$users/auth/lucia/modules-compat';
import { PresenceService } from '$users/presence/presence.service';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { GlobalDatabaseUserAttributes } from 'lucia';
import { EnvironmentConfig } from '~env';
import { Auth, LuciaFactory } from './lucia/lucia.factory';
import { LuciaSession } from './session.decorator';

export type CreateUserLuciaAttributes = Partial<Omit<GlobalDatabaseUserAttributes, 'email'>>;

@Injectable()
export class AuthService {
	constructor(
		@Inject(LuciaFactory) private readonly auth: Auth,
		private readonly prisma: PrismaService,
		private readonly email: EmailService,
		private readonly i18n: TypedI18nService,
		private readonly env: EnvironmentConfig,
		private readonly presenceService: PresenceService,
	) {}

	readonly providerId = 'email';

	defineEmailKey(email: string, password: string | null): Omit<Parameters<typeof this.auth.createKey>[0], 'userId'>;
	defineEmailKey(email: string, password: string | null, userId: string): Parameters<typeof this.auth.createKey>[0];
	defineEmailKey(email: string, password: string | null, userId?: string) {
		if (userId) {
			return {
				providerId: this.providerId,
				providerUserId: email,
				password,
				userId,
			} satisfies Parameters<typeof this.auth.createKey>[0];
		}

		return {
			providerId: this.providerId,
			providerUserId: email,
			password,
		};
	}

	async getLuciaUser(userId: string) {
		return this.auth.getUser(userId);
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
			throw new Error('Invalid registration token!');
		}

		return user;
	}

	async createUser(email: string, password: string | null, attributes?: CreateUserLuciaAttributes) {
		const userWithEmail = await this.prisma.user.count({
			where: {
				email,
			},
		});

		if (userWithEmail !== 0) {
			throw new BadRequestException('A user with this email already exists!'); // TODO : i18n
		}

		const registerTokenLength = 16;
		const registerToken = password ? null : (await loadLuciaUtils()).generateRandomString(registerTokenLength);

		const user = await this.auth.createUser({
			key: password ? this.defineEmailKey(email, password) : null,
			attributes: {
				email,
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
			throw new Error('Invalid userId!');
		}

		const key = await this.auth.createKey(this.defineEmailKey(user.email, password, user.id));

		await this.auth.updateUserAttributes(key.userId, {
			...attributes,
			registerToken: null,
		});

		return this.loginUser(key.userId);
	}

	async login(email: string, password: string) {
		const key = await this.auth.useKey(this.providerId, email, password);

		const session = await this.loginUser(key.userId);

		// this.presenceService.onConnect(session);

		return session;
	}

	async loginUser(userId: string) {
		const session = await this.auth.createSession({ userId, attributes: {} });

		return session;
	}

	async logout(session: LuciaSession) {
		await this.auth.invalidateSession(session.sessionId);

		// this.presenceService.onDisconnect(session);

		return this.auth.createSessionCookie(null);
	}

	async getForgotPasswordRequestToken() {
		const forgotPasswordTokenLength = 16;
		const forgotPasswordToken = (await loadLuciaUtils()).generateRandomString(forgotPasswordTokenLength);

		return forgotPasswordToken;
	}

	// eslint-disable-next-line @typescript-eslint/no-magic-numbers
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
			from: { email: this.env.EMAIL_FROM },
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
				await tx.passwordResetAttempt.update({
					data: {
						used: {
							set: true,
						},
					},
					where: {
						id,
					},
				});

				await this.auth.updateKeyPassword(this.providerId, user.email, password);
			});

			await this.auth.invalidateAllUserSessions(user.id);
		} catch (error) {
			// eh
		}

		return { user };
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
			from: { email: this.env.EMAIL_FROM },
			subject: this.i18n.t('auth.emails.password_reset.subject', { lang }),
		});
	}

	subscribeUserEdited(select: PrismaSelector, triggers: PrismaSubscribeTriggers) {
		return this.prisma.subscribe(triggers, select);
	}
}
