import { UserUpdateInput } from '$prisma-graphql/user';
import { PrismaSelector, PrismaService } from '$prisma/prisma.service';
import { USER_EDITED } from '$users/auth/constants/triggers';
import { PresenceService, UserOnlineSelector } from '$users/presence/presence.service';
import { Injectable } from '@nestjs/common';
import { User } from 'lucia';

@Injectable()
export class UserProfileService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly presenceService: PresenceService,
	) {}

	async editUser(select: PrismaSelector, user: User, data: UserUpdateInput) {
		const updatedUser = await this.prisma.mutate([USER_EDITED], select, async (allSelect) => {
			const { online, selector } = this.prisma.extractSelectors<UserOnlineSelector>(allSelect, 'online');

			const updatedUser = await this.prisma.user.update({
				where: {
					email: user.email,
				},
				data,
				...selector,
			});

			return this.presenceService.convertUserToLiveUser(updatedUser, online);
		});

		return updatedUser;
	}
}
