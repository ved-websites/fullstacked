import { EmailService } from '$email/email.service';
import { EventData } from '$events/events.decorator';
import { EventsService } from '$events/events.service';
import { I18nException } from '$i18n/i18n.error';
import { TypedI18nService } from '$i18n/i18n.service';
import { PrismaService } from '$prisma/prisma.service';
import { SocketService } from '$socket/socket.service';
import { AuthService } from '$users/auth/auth.service';
import { RolesService } from '$users/auth/roles/roles.service';
import { AppUser } from '$users/auth/session/session.decorator';
import { PresenceService } from '$users/presence/presence.service';
import UserUpdateInputSchema from '$zod/inputTypeSchemas/UserUpdateInputSchema';
import { Injectable } from '@nestjs/common';
import { z } from 'zod/v4';
import { wsR } from '~contract';
import { Roles } from '~shared';
import { UserCreateInputNoId } from './admin.contract';
import { ADMIN_CREATE_USER_EVENT } from './listeners/admin.events';

@Injectable()
export class AdminService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly authService: AuthService,
		private readonly rolesService: RolesService,
		private readonly events: EventsService,
		private readonly email: EmailService,
		private readonly i18n: TypedI18nService,
		private readonly presenceService: PresenceService,
		private readonly sockets: SocketService,
	) {}

	async getUsers() {
		const users = await this.prisma.user.findMany({
			orderBy: {
				createdAt: 'asc',
			},
			include: {
				roles: true,
			},
		});

		return users.map((user) => ({
			...user,
			online: !user.registerToken ? this.presenceService.isUserConnected(user.id) : null,
		}));
	}

	async getUser(email: string) {
		const user = await this.prisma.user.findFirst({
			where: {
				email,
			},
		});

		return user;
	}

	async getUserForEdit(email: string) {
		const userPromise = this.prisma.user.findFirst({
			where: {
				email,
			},
			include: {
				roles: true,
			},
		});

		const rolesPromise = this.prisma.role.findMany({
			select: {
				id: true,
				text: true,
			},
		});

		const [user, roles] = await Promise.all([userPromise, rolesPromise]);

		return { user, roles };
	}

	async createUser(data: UserCreateInputNoId, origin: EventData<typeof ADMIN_CREATE_USER_EVENT>[1]) {
		const { email, firstName, lastName, roles, emailLang } = data;

		const user = (await this.authService.createUser(email, null, {
			firstName,
			lastName,
			emailLang,
		})) satisfies AppUser as Omit<AppUser, 'registerToken'> & { registerToken: NonNullable<AppUser['registerToken']> };

		if (roles) {
			await this.rolesService.setUserRoles(user, roles);
		}

		this.events.emit(ADMIN_CREATE_USER_EVENT, [user, origin]);

		const userRoles = await this.rolesService.getRolesOfUser(user.email);

		this.sockets.emit(wsR.users.created, { ...user, roles: userRoles });

		return user;
	}

	async editUser(email: string, data: Pick<z.output<typeof UserUpdateInputSchema>, 'firstName' | 'lastName' | 'roles'>) {
		if (data.roles?.set) {
			const shouldCheckRemainsAdmin = Array.isArray(data.roles.set)
				? data.roles.set.every((role) => role.text !== Roles.ADMIN.name)
				: data.roles.set.text !== Roles.ADMIN.name;

			if (shouldCheckRemainsAdmin) {
				const otherAdminsCount = await this.prisma.user.count({
					where: {
						email: {
							not: email,
						},
						roles: {
							some: {
								text: {
									equals: Roles.ADMIN.name,
								},
							},
						},
					},
				});

				if (!otherAdminsCount) {
					throw new I18nException('admin.errors.last.role');
				}
			}
		}

		const updatedUser = await this.prisma.user.update({
			where: {
				email,
			},
			data,
			include: {
				roles: true,
			},
		});

		const liveUser = this.presenceService.convertUserToLiveUser(updatedUser);

		this.sockets.emit(wsR.users.edited, liveUser);

		return liveUser;
	}

	async deleteUser(email: string) {
		const otherAdminsCount = await this.prisma.user.count({
			where: {
				email: {
					not: email,
				},
				roles: {
					some: {
						text: {
							equals: Roles.ADMIN.name,
						},
					},
				},
			},
		});

		if (!otherAdminsCount) {
			throw new I18nException('admin.errors.last.user');
		}

		const deletedUser = await this.prisma.user.delete({
			where: { email },
		});

		this.sockets.emit(wsR.users.deleted, deletedUser);

		return deletedUser;
	}

	async resendUserInviteLink(email: string, origin: { url: string; user: AppUser }) {
		try {
			const dbUserToResendTo = await this.getUser(email);

			if (!dbUserToResendTo) {
				return false;
			}

			const userToResendTo = await this.authService.getAppUser(dbUserToResendTo.id);

			await this.sendNewUserRegistrationEmail(userToResendTo, origin);
			return true;
		} catch (_error) {
			return false;
		}
	}

	async sendNewUserRegistrationEmail(user: AppUser, origin: { url: string; user: AppUser }) {
		if (!user.registerToken) {
			return;
		}

		const lang = user.emailLang;

		const templateData = {
			name: user.fullName ?? user.email,
			url: `${origin.url}/register?token=${user.registerToken}`,
			i18nLang: lang,
		};

		return this.email.renderAndSend(['./emails/RegisterEmail.hbs', templateData], {
			to: { email: user.email, name: user.fullName },
			from: { name: origin.user.fullName },
			replyTo: { email: origin.user.email, name: origin.user.fullName },
			subject: this.i18n.t('admin.emails.register.subject', { lang }),
		});
	}
}
