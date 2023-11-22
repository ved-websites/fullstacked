import { User } from '$prisma-client';
import { LuciaSession } from '$users/auth/session.decorator';
import { LiveUser } from '$users/dtos/LiveUser.dto';
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
		this.sessions.set(session.sessionId, session);

		this.eventEmitter.emitAsync(USERS_ON_CONNECT_EVENT_KEY, session satisfies USERS_ON_CONNECT_EVENT_TYPE);
	}

	onDisconnect(session: LuciaSession) {
		const hadSession = this.sessions.delete(session.sessionId);

		if (hadSession) {
			this.eventEmitter.emitAsync(USERS_ON_DISCONNECT_EVENT_KEY, session satisfies USERS_ON_DISCONNECT_EVENT_TYPE);
		}
	}

	isUserConnected(email: string) {
		const sessionsArray = Array.from(this.sessions.values());

		return sessionsArray.some((s) => s.user.email === email);
	}

	convertUserToLiveUser(user: User, onlineSelector?: boolean | undefined): LiveUser;
	convertUserToLiveUser(user: User | null | undefined, onlineSelector?: boolean | undefined): LiveUser | null;

	convertUserToLiveUser(user: User | null | undefined, onlineSelector: boolean | undefined = true): LiveUser | null {
		// is passing by reference but eh
		const liveUser = user as LiveUser | null | undefined;

		if (liveUser && onlineSelector) {
			liveUser.online = this.isUserConnected(liveUser.email);
		}

		return liveUser ?? null;
	}
}
