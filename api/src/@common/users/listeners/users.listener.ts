import { EventData, OnEvent } from '$events/events.decorator';
import { PrismaService } from '$prisma/prisma.service';
import { SocketService } from '$socket/socket.service';
import { PresenceService } from '$users/presence/presence.service';
import { Injectable, Logger } from '@nestjs/common';
import { wsR } from '~contract';
import { USERS_ON_CONNECT_EVENT, USERS_ON_DISCONNECT_EVENT } from './users.events';

@Injectable()
export class UsersListener {
	private readonly logger = new Logger(UsersListener.name);

	constructor(
		private readonly sockets: SocketService,
		private readonly presenceService: PresenceService,
		private readonly prisma: PrismaService,
	) {}

	@OnEvent(USERS_ON_CONNECT_EVENT, { async: true })
	async handleUserConnectedEvent(userId: EventData<typeof USERS_ON_CONNECT_EVENT>) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		});

		if (!user) {
			return;
		}

		const liveUser = this.presenceService.convertUserToLiveUser(user);

		this.sockets.emit(wsR.users.onlineChange, liveUser);
	}

	@OnEvent(USERS_ON_DISCONNECT_EVENT, { async: true })
	async handleUserDisconnectedEvent(userId: EventData<typeof USERS_ON_DISCONNECT_EVENT>) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		});

		if (!user) {
			return;
		}

		const liveUser = this.presenceService.convertUserToLiveUser(user);

		this.sockets.emit(wsR.users.onlineChange, liveUser);
	}
}
