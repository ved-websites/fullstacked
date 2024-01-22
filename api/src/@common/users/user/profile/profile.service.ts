import { UserUpdateInput } from '$prisma-graphql/user';
import { PrismaSelector, PrismaService } from '$prisma/prisma.service';
import { SocketService } from '$socket/socket.service';
import { USER_EDITED } from '$users/auth/constants/triggers';
import { PresenceService, UserOnlineSelector } from '$users/presence/presence.service';
import UserUpdateInputSchema from '$zod/inputTypeSchemas/UserUpdateInputSchema';
import { Injectable } from '@nestjs/common';
import { User } from 'lucia';
import { z } from 'zod';
import { wsR } from '~contract';

@Injectable()
export class UserProfileService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly presenceService: PresenceService,
		private readonly sockets: SocketService,
	) {}

	async editUser(user: User, data: z.output<typeof UserUpdateInputSchema>) {
		const updatedUser = await this.prisma.user.update({
			where: {
				email: user.email,
			},
			data,
			include: {
				roles: true,
			},
		});

		this.sockets.emit(wsR.users.edited, this.presenceService.convertUserToLiveUser(updatedUser));

		return updatedUser;
	}

	async editUserGql(select: PrismaSelector, user: User, data: UserUpdateInput) {
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
