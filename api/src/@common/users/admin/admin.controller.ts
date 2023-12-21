import { PrismaSelector, PrismaService } from '$prisma/prisma.service';
import { AuthService } from '$users/auth/auth.service';
import { Roles } from '$users/auth/roles/roles.guard';
import { PresenceService, UserOnlineSelector } from '$users/presence/presence.service';
import { Controller } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { r } from '~contract';
import { ADMIN } from '~utils/roles';
import { AdminService } from './admin.service';

@Controller()
// @TsRest({ jsonQuery: true })
export class AdminController {
	constructor(
		private readonly adminService: AdminService,
		private readonly authService: AuthService,
		private readonly prisma: PrismaService,
		private readonly presenceService: PresenceService,
	) {}

	@Roles([ADMIN])
	@TsRestHandler(r.users.admin.listUsers)
	async getUsers() {
		return tsRestHandler(r.users.admin.listUsers, async () => {
			const users = await this.prisma.user.findMany({
				orderBy: {
					createdAt: 'asc',
				},
				include: {
					roles: true,
				},
			});

			// const liveUsers = users.map(user => this.presenceService.convertUserToLiveUser(user));

			const liveUsers = users.map((user) => ({
				...user,
				online: this.presenceService.isUserConnected(user.email),
			}));

			return {
				status: 200,
				body: liveUsers,
			};
		});
	}

	@Roles([ADMIN])
	@TsRestHandler(r.users.admin.listUsersGQL, {
		jsonQuery: true,
	})
	async getUsersGql() {
		return tsRestHandler(r.users.admin.listUsersGQL, async (data) => {
			const { select, ...findArgs } = data.query;

			const { online, selector } = this.prisma.extractSelectors<UserOnlineSelector>({ select } as unknown as PrismaSelector, 'online');

			const users = await this.prisma.user.findMany({
				...selector,
				...findArgs,
			});

			const liveUsers = users.map<Partial<(typeof users)[number] & { online: boolean }>>((user) => ({
				...user,
				online: online && this.presenceService.isUserConnected(user.email),
			}));

			return {
				status: 200,
				body: liveUsers,
			};
		});
	}
}
