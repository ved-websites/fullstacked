import { EmailService } from '$email/email.service';
import { I18nException } from '$i18n/i18n.error';
import { TypedI18nService } from '$i18n/i18n.service';
import { UserCreateInput, UserUpdateInput, UserWhereInput, UserWhereUniqueInput } from '$prisma-graphql/user';
import { PrismaSelector, PrismaService } from '$prisma/prisma.service';
import { AuthService } from '$users/auth/auth.service';
import { USER_EDITED } from '$users/auth/constants/triggers';
import { RolesService } from '$users/auth/roles/roles.service';
import { LuciaUser } from '$users/auth/session.decorator';
import { LiveUser } from '$users/dtos/LiveUser.dto';
import { PresenceService, UserOnlineSelector } from '$users/presence/presence.service';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ADMIN } from '~/@utils/roles';
import { EnvironmentConfig } from '~/env.validation';
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
	) {}

	async getUsers(select: PrismaSelector, where?: UserWhereInput) {
		const { online, selector } = this.prisma.extractSelectors<UserOnlineSelector>(select, 'online');

		const users = await this.prisma.user.findMany({
			where,
			...selector,
			orderBy: {
				createdAt: 'asc',
			},
		});

		return users.map<LiveUser>((user) => ({
			...user,
			online: online && this.presenceService.isUserConnected(user.email),
		}));
	}

	async getUser(select: PrismaSelector, where: UserWhereUniqueInput) {
		const { online, selector } = this.prisma.extractSelectors<UserOnlineSelector>(select, 'online');

		const user = await this.prisma.user.findFirst({
			where,
			...selector,
		});

		return this.presenceService.convertUserToLiveUser(user, online);
	}

	async createUser(data: UserCreateInput, origin: ADMIN_CREATE_USER_EVENT_TYPE[1]) {
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

		return user;
	}

	async editUser(select: PrismaSelector, where: UserWhereUniqueInput, data: UserUpdateInput) {
		if (data.roles?.set?.every((role) => role.text != ADMIN)) {
			// if no role has admin, check if at least one admin would remain
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
				throw new I18nException('admin.errors.last.role');
			}
		}

		const updatedUser = await this.prisma.mutate([USER_EDITED], select, async (allSelect) => {
			const { online, selector } = this.prisma.extractSelectors<UserOnlineSelector>(allSelect, 'online');

			const user = await this.prisma.user.update({ where, data, ...selector });

			return this.presenceService.convertUserToLiveUser(user, online);
		});

		return updatedUser;
	}

	async deleteUser(select: PrismaSelector, where: UserWhereUniqueInput) {
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
