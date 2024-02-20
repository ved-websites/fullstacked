import { EmailService } from '$email/email.service';
import { TypedI18nService } from '$i18n/i18n.service';
import { PrismaService } from '$prisma/prisma.service';
import { SocketService } from '$socket/socket.service';
import { LuciaUser } from '$users/auth/types';
import { PresenceService } from '$users/presence/presence.service';
import { generateRandomSafeString } from '$utils/random';
import UserUpdateInputSchema from '$zod/inputTypeSchemas/UserUpdateInputSchema';
import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { wsR } from '~contract';
import { EnvironmentConfig } from '~env';

export const maxEmailResetTokenDurationInMinutes = 15;

@Injectable()
export class UserProfileService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly presenceService: PresenceService,
		private readonly sockets: SocketService,
		private readonly email: EmailService,
		private readonly i18n: TypedI18nService,
		private readonly env: EnvironmentConfig,
	) {}

	async editUser(user: LuciaUser, data: Omit<z.output<typeof UserUpdateInputSchema>, 'email' | 'hashedPassword'>) {
		const updatedUser = await this.prisma.user.update({
			where: {
				id: user.id,
			},
			data,
			include: {
				roles: true,
			},
		});

		this.sockets.emit(wsR.users.edited, this.presenceService.convertUserToLiveUser(updatedUser));

		return updatedUser;
	}

	async requestEditUserEmail(user: LuciaUser, email: string, origin: string) {
		const emailAlreadyUsed = await this.prisma.user.exists({ email });

		if (emailAlreadyUsed) {
			throw new Error(this.i18n.t('users.settings.errors.email.used'));
		}

		const validRequestsMaxDate = new Date(Date.now() - 1000 * 60 * maxEmailResetTokenDurationInMinutes);

		const newEmailAlreadyUsed = await this.prisma.userEmailChangeRequest.exists({
			newEmail: email,
			used: false,
			createdAt: { gt: validRequestsMaxDate },
		});

		if (newEmailAlreadyUsed) {
			throw new Error(this.i18n.t('users.settings.errors.email.reserved'));
		}

		const lang = user.emailLang;

		const templateData = {
			name: user.fullName ?? user.email,
			i18nLang: lang,
		};

		const emailResetToken = await generateRandomSafeString();

		await this.prisma.userEmailChangeRequest.create({
			data: {
				newEmail: email,
				emailResetToken,
				user: {
					connect: {
						id: user.id,
					},
				},
			},
		});

		this.email.renderAndSend(['./emails/change-user-email/NotifyEmail.hbs', templateData], {
			to: { email: user.email, name: user.fullName },
			from: { email: this.env.EMAIL_FROM },
			subject: this.i18n.t('users.emails.settings.email.notify.subject', { lang }),
		});
		this.email.renderAndSend(
			[
				'./emails/change-user-email/ConfirmEmail.hbs',
				{ ...templateData, url: `${origin}/settings/profile/email?token=${emailResetToken}` },
			],
			{
				to: { email: email, name: user.fullName },
				from: { email: this.env.EMAIL_FROM },
				subject: this.i18n.t('users.emails.settings.email.confirm.subject', { lang }),
			},
		);

		return true;
	}

	async editUserEmail(token: string, _origin: string) {
		const validRequestsMaxDate = new Date(Date.now() - 1000 * 60 * maxEmailResetTokenDurationInMinutes);

		const updatedUser = await this.prisma
			.$transaction(async (tx) => {
				const userEmailChangeRequest = await tx.userEmailChangeRequest.update({
					where: {
						emailResetToken: token,
						createdAt: {
							gt: validRequestsMaxDate,
						},
						used: false,
					},
					data: {
						used: true,
					},
					select: {
						newEmail: true,
						user: {
							select: {
								id: true,
							},
						},
					},
				});

				return tx.user.update({
					where: {
						id: userEmailChangeRequest.user.id,
					},
					data: {
						email: userEmailChangeRequest.newEmail,
					},
					include: {
						roles: true,
					},
				});
			})
			.catch(() => false as const);

		if (!updatedUser) {
			return false;
		}

		const lang = updatedUser.emailLang;

		const templateData = {
			name: updatedUser.fullName ?? updatedUser.email,
			i18nLang: lang,
		};

		// TODO: Add website origin in email

		this.email.renderAndSend(['./emails/change-user-email/UpdatedEmail.hbs', templateData], {
			to: { email: updatedUser.email, name: updatedUser.fullName },
			from: { email: this.env.EMAIL_FROM },
			subject: this.i18n.t('users.emails.settings.email.updated.subject', { lang }),
		});

		this.sockets.emit(wsR.users.edited, this.presenceService.convertUserToLiveUser(updatedUser));

		return true;
	}
}
