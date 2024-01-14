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
		private readonly prisma: PrismaService,
		private readonly sockets: SocketService,
		private readonly presenceService: PresenceService,
	) {}

	@OnEvent(USERS_ON_CONNECT_EVENT_KEY, { async: true })
	async handleUserConnectedEvent(session: USERS_ON_CONNECT_EVENT_TYPE) {
		const liveUser = this.presenceService.convertUserToLiveUser(session.user);

		const rolesData = await this.prisma.user.findUniqueOrThrow({
			where: {
				email: liveUser.email,
			},
			select: {
				roles: true,
			},
		});

		this.sockets.emit(wsR.auth.update, { ...liveUser, ...rolesData });
	}

	@OnEvent(USERS_ON_DISCONNECT_EVENT_KEY, { async: true })
	async handleUserDisconnectedEvent(session: USERS_ON_DISCONNECT_EVENT_TYPE) {
		const liveUser = this.presenceService.convertUserToLiveUser(session.user);

		const rolesData = await this.prisma.user.findUniqueOrThrow({
			where: {
				email: liveUser.email,
			},
			select: {
				roles: true,
			},
		});

		this.sockets.emit(wsR.auth.update, { ...liveUser, ...rolesData });
	}
}
