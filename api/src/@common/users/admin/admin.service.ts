import { EmailService } from '$email/email.service';
import { I18nException } from '$i18n/i18n.error';
import { TypedI18nService } from '$i18n/i18n.service';
import { UserWhereUniqueInput } from '$prisma-graphql/user';
import { PrismaSelector, PrismaService } from '$prisma/prisma.service';
import { SocketService } from '$socket/socket.service';
import { AuthService } from '$users/auth/auth.service';
import { RolesService } from '$users/auth/roles/roles.service';
import { LuciaUser } from '$users/auth/session.decorator';
import { PresenceService, UserOnlineSelector } from '$users/presence/presence.service';
import UserUpdateInputSchema from '$zod/inputTypeSchemas/UserUpdateInputSchema';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { z } from 'zod';
import { wsR } from '~contract';
import { EnvironmentConfig } from '~env';
import { ADMIN } from '~utils/roles';
import { AdminListUsersGql, UserCreateInputNoId } from './admin.contract';
import { ADMIN_CREATE_USER_EVENT_KEY, ADMIN_CREATE_USER_EVENT_TYPE } from './listeners/admin.events';

@Injectable()
export class AdminService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly authService: AuthService,
		private readonly rolesService: RolesService,
		private eventEmitter: EventEmitter2,
		private readonly email: EmailService,
		private readonly env: EnvironmentConfig,
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
			online: !user.registerToken ? this.presenceService.isUserConnected(user.email) : null,
		}));
	}

	async getUsersGql(data: AdminListUsersGql) {
		const { select, ...findArgs } = data;

		const { online, selector } = this.prisma.extractSelectors<UserOnlineSelector>({ select } as unknown as PrismaSelector, 'online');

		const users = await this.prisma.user.findMany({
			...selector,
			...findArgs,
		});

		return users.map<Partial<(typeof users)[number] & { online: boolean }>>((user) => ({
			...user,
			online: online && this.presenceService.isUserConnected(user.email),
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
				roles: {
					select: {
						text: true,
					},
				},
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

	async createUser(data: UserCreateInputNoId, origin: ADMIN_CREATE_USER_EVENT_TYPE[1]) {
		const { email, firstName, lastName, roles, emailLang } = data;

		const user = (await this.authService.createUser(email, null, {
			firstName,
			lastName,
			emailLang,
		})) satisfies LuciaUser as Omit<LuciaUser, 'registerToken'> & { registerToken: NonNullable<LuciaUser['registerToken']> };

		if (roles) {
			await this.rolesService.setUserRoles(user, roles);
		}

		this.eventEmitter.emit(ADMIN_CREATE_USER_EVENT_KEY, [user, origin] satisfies ADMIN_CREATE_USER_EVENT_TYPE);

		const userRoles = await this.rolesService.getRolesOfUser(user.email);

		this.sockets.emit(wsR.users.created, { ...user, roles: userRoles });

		return user;
	}

	async editUser(email: string, data: Pick<z.output<typeof UserUpdateInputSchema>, 'firstName' | 'lastName' | 'roles'>) {
		if (data.roles?.set) {
			const shouldCheckRemainsAdmin = Array.isArray(data.roles.set)
				? data.roles.set.every((role) => role.text !== ADMIN)
				: data.roles.set.text !== ADMIN;

			if (shouldCheckRemainsAdmin) {
				const otherAdminsCount = await this.prisma.user.count({
					where: {
						email: {
							not: email,
						},
						roles: {
							some: {
								text: {
									equals: ADMIN,
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
							equals: ADMIN,
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
	async deleteUserGql(select: PrismaSelector, where: UserWhereUniqueInput) {
		const otherAdminsCount = await this.prisma.user.count({
			where: {
				email: {
					not: where.email,
				},
				roles: {
					some: {
						text: {
							equals: ADMIN,
						},
					},
				},
			},
		});

		if (!otherAdminsCount) {
			throw new I18nException('admin.errors.last.user');
		}

		const deletedUser = await this.prisma.user.delete({
			where,
			...select,
		});

		return deletedUser;
	}

	async resendUserInviteLink(email: string, origin: { url: string; user: LuciaUser }) {
		try {
			const dbUserToResendTo = await this.getUser(email);

			if (!dbUserToResendTo) {
				return false;
			}

			const userToResendTo = await this.authService.getLuciaUser(dbUserToResendTo.id);

			await this.sendNewUserRegistrationEmail(userToResendTo, origin);
			return true;
		} catch (error) {
			return false;
		}
	}

	async sendNewUserRegistrationEmail(user: Omit<LuciaUser, 'userId'>, origin: { url: string; user: LuciaUser }) {
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
			from: { email: this.env.EMAIL_FROM, name: origin.user.fullName },
			replyTo: { email: origin.user.email, name: origin.user.fullName },
			subject: this.i18n.t('admin.emails.register.subject', { lang }),
		});
	}
}
