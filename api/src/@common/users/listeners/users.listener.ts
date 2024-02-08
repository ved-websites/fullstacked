import { PrismaService } from '$prisma/prisma.service';
import { SocketService } from '$socket/socket.service';
import { PresenceService } from '$users/presence/presence.service';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { wsR } from '~contract';
import {
	USERS_ON_CONNECT_EVENT_KEY,
	USERS_ON_CONNECT_EVENT_TYPE,
	USERS_ON_DISCONNECT_EVENT_KEY,
	USERS_ON_DISCONNECT_EVENT_TYPE,
} from './users.events';

@Injectable()
export class UsersListener {
	private readonly logger = new Logger(UsersListener.name);

	constructor(
		private readonly sockets: SocketService,
		private readonly presenceService: PresenceService,
		private readonly prisma: PrismaService,
	) {}

	@OnEvent(USERS_ON_CONNECT_EVENT_KEY, { async: true })
	async handleUserConnectedEvent(userId: USERS_ON_CONNECT_EVENT_TYPE) {
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

	@OnEvent(USERS_ON_DISCONNECT_EVENT_KEY, { async: true })
	async handleUserDisconnectedEvent(userId: USERS_ON_DISCONNECT_EVENT_TYPE) {
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
