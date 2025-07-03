import { User } from '$prisma-client';
import { PrismaService } from '$prisma/prisma.service';
import { SocketService } from '$socket/socket.service';
import { PresenceService } from '$users/presence/presence.service';
import UserUpdateInputSchema from '$zod/inputTypeSchemas/UserUpdateInputSchema';
import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { wsR } from '~contract';

@Injectable()
export class UserProfileService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly presenceService: PresenceService,
		private readonly sockets: SocketService,
	) {}

	async editUser(user: Pick<User, 'id'>, data: Omit<z.output<typeof UserUpdateInputSchema>, 'email' | 'hashedPassword'>) {
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
}
