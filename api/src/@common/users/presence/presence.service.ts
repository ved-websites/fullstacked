import { EventsService } from '$events/events.service';
import { User } from '$prisma-client';
import { LuciaSession } from '$users/auth/session.decorator';
import { Injectable, Logger } from '@nestjs/common';
import { USERS_ON_CONNECT_EVENT, USERS_ON_DISCONNECT_EVENT } from '../listeners/users.events';

export type UserOnlineSelector = { online: boolean };

@Injectable()
export class PresenceService {
	private readonly logger = new Logger(PresenceService.name);

	private sessions: Map<string, LuciaSession> = new Map();

	constructor(private events: EventsService) {}

	onConnect(session: LuciaSession) {
		this.sessions.set(session.id, session);

		this.events.emitAsync(USERS_ON_CONNECT_EVENT, session.userId);
	}

	onDisconnect(session: LuciaSession) {
		const hadSession = this.sessions.delete(session.id);

		if (hadSession) {
			this.events.emitAsync(USERS_ON_DISCONNECT_EVENT, session.userId);
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
