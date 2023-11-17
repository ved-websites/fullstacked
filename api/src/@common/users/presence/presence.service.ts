import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { Session } from 'lucia';
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

	private sessions: Map<string, Session> = new Map();

	constructor(private eventEmitter: EventEmitter2) {}

	onConnect(session: Session) {
		this.sessions.set(session.sessionId, session);

		this.eventEmitter.emitAsync(USERS_ON_CONNECT_EVENT_KEY, session satisfies USERS_ON_CONNECT_EVENT_TYPE);
	}

	onDisconnect(session: Session) {
		const hadSession = this.sessions.delete(session.sessionId);

		if (!hadSession) {
			this.logger.error(`Race condition, the user "${session.user.email}" disconnected event came before the connection event!`);
		}

		this.eventEmitter.emitAsync(USERS_ON_DISCONNECT_EVENT_KEY, session satisfies USERS_ON_DISCONNECT_EVENT_TYPE);
	}

	isUserConnected(email: string) {
		const sessionsArray = Array.from(this.sessions.values());

		return sessionsArray.some((s) => s.user.email === email);
	}
}
