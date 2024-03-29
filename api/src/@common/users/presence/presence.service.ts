import { User } from '$prisma-client';
import { LuciaSession } from '$users/auth/session.decorator';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
	USERS_ON_CONNECT_EVENT_KEY,
	USERS_ON_CONNECT_EVENT_TYPE,
	USERS_ON_DISCONNECT_EVENT_KEY,
	USERS_ON_DISCONNECT_EVENT_TYPE,
} from '../listeners/users.events';

export type UserOnlineSelector = { online: boolean };

@Injectable()
export class PresenceService {
	private readonly logger = new Logger(PresenceService.name);

	private sessions: Map<string, LuciaSession> = new Map();

	constructor(private eventEmitter: EventEmitter2) {}

	onConnect(session: LuciaSession) {
		this.sessions.set(session.id, session);

		this.eventEmitter.emitAsync(USERS_ON_CONNECT_EVENT_KEY, session.userId satisfies USERS_ON_CONNECT_EVENT_TYPE);
	}

	onDisconnect(session: LuciaSession) {
		const hadSession = this.sessions.delete(session.id);

		if (hadSession) {
			this.eventEmitter.emitAsync(USERS_ON_DISCONNECT_EVENT_KEY, session.userId satisfies USERS_ON_DISCONNECT_EVENT_TYPE);
		}
	}

	isUserConnected(userId: string) {
		const sessionsArray = Array.from(this.sessions.values());

		return sessionsArray.some(({ userId: sessionUserId }) => sessionUserId === userId);
	}

	convertUserToLiveUser<U extends Pick<User, 'id'> = Pick<User, 'id'>>(
		user: U,
		onlineSelector?: boolean | undefined,
	): U & { online: boolean | null };
	convertUserToLiveUser<U extends Pick<User, 'id'> = Pick<User, 'id'>>(
		user: U | null | undefined,
		onlineSelector?: boolean | undefined,
	): (U & { online: boolean | null }) | null;

	convertUserToLiveUser<U extends Pick<User, 'id'> = Pick<User, 'id'>>(
		user: U | null | undefined,
		onlineSelector: boolean | undefined = true,
	): (U & { online: boolean | null }) | null {
		const liveUser = user as (U & { online: boolean | null }) | null | undefined;

		if (liveUser && onlineSelector) {
			liveUser.online = this.isUserConnected(liveUser.id);
		}

		return liveUser ?? null;
	}
}
