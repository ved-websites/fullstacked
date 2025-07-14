import { UserContainer } from '$users/auth/types';
import { PresenceService } from '$users/presence/presence.service';
import { Injectable, Logger } from '@nestjs/common';
import type { IncomingMessage } from 'http';
import { Server, WebSocket } from 'ws';
import type { z } from 'zod/v4';
import { EventRouteOutput, EventUID, extractEventRouteKey, type EventRoute } from '~contract';
import { WsEventEmitter } from './ts-ws/ws-event.emitter';
import type { SocketOrSessionId, TypedWebSocket } from './types';

@Injectable()
export class SocketService {
	private readonly logger = new Logger(SocketService.name);

	server!: Server;

	private handshakeMap = new Map<string, UserContainer>();

	constructor(
		private readonly wsEmitter: WsEventEmitter,
		private readonly presenceService: PresenceService,
	) {}

	async onClientConnect(socket: TypedWebSocket, request: IncomingMessage) {
		if (!request.url) {
			this.logger.error(`Incoming request has no url, aborting client connection.`);
			return;
		}

		const url = new URL(request.url, `http://${request.headers.host}`);

		const token = url.searchParams.get('token');

		if (!token) {
			this.logger.debug(`Client did not add token to request url, aborting client connection.`);
			return;
		}

		const handshake = this.handshakeMap.get(token);

		if (!handshake) {
			this.logger.debug(`No handshake associated with provided token, aborting client connection.`);
			return;
		}

		socket.session = handshake.session;
		socket.user = handshake.user;

		socket.setMaxListeners(Infinity);

		if (socket.session) {
			this.presenceService.onConnect(socket.session);
		}

		this.handshakeMap.delete(token);
	}

	onClientDisconnect(socket: TypedWebSocket) {
		if (socket.session) {
			this.presenceService.onDisconnect(socket.session);
		}
	}

	addHandshake(token: string, container: UserContainer) {
		this.handshakeMap.set(token, container);

		const handshakeMaximumDelay = 10; // in seconds

		setTimeout(() => {
			this.handshakeMap.delete(token);
		}, handshakeMaximumDelay * 1000);
	}

	sendMessage(socketOrSessionId: SocketOrSessionId, message: string, uid?: EventUID) {
		const formattedMessage = this.formatData(message, uid);

		return this.sendBlob(socketOrSessionId, formattedMessage);
	}

	sendData(socketOrSessionId: SocketOrSessionId, data: EventRouteOutput<unknown>) {
		return this.sendBlob(socketOrSessionId, data);
	}

	formatData(data: string | unknown, uid: EventUID | undefined, type = 'message') {
		const details = typeof data === 'string' ? { message: data } : data instanceof Object ? data : JSON.parse(JSON.stringify(data));

		return {
			type,
			uid,
			data: {
				...details,
			},
		} satisfies EventRouteOutput<unknown>;
	}

	sendError(socketOrSessionId: SocketOrSessionId, error: string | object, uid?: EventUID) {
		const errorData = this.formatErrorMessage(error, uid);

		return this.sendBlob(socketOrSessionId, errorData);
	}

	formatErrorMessage(error: string | object, uid: EventUID | undefined) {
		const details = error instanceof Object ? { ...error } : { message: error };

		return {
			type: 'error',
			uid,
			data: {
				...details,
			},
		} satisfies EventRouteOutput<unknown>;
	}

	protected sendBlob(socketOrSessionId: SocketOrSessionId, data: EventRouteOutput<unknown>) {
		const socket = this.getSocket(socketOrSessionId);

		if (!socket) {
			return;
		}

		const sendableData = JSON.stringify(data);

		return socket.send(sendableData);
	}

	getSocketsOf(userId: string) {
		const allSockets = Array.from(this.server.clients.values()) as TypedWebSocket[];

		return allSockets.filter((socket) => socket.user?.id === userId);
	}

	flushUserSockets(userId: string) {
		const sockets = this.getSocketsOf(userId);

		sockets.forEach((socket) => {
			this.flush(socket);
		});
	}

	emit<E extends EventRoute>(event: E, data: z.output<E['emitted']>) {
		const key = extractEventRouteKey(event);

		return this.wsEmitter.emit(key, data);
	}

	createFlushPattern(socketOrSessionId: SocketOrSessionId) {
		const sessionId = this.getSessionId(socketOrSessionId);

		if (!sessionId) {
			return;
		}

		return `flush:${sessionId}`;
	}

	flush(socketOrSessionId: SocketOrSessionId) {
		const event = this.createFlushPattern(socketOrSessionId);

		if (!event) {
			return;
		}

		return this.wsEmitter.emit(event);
	}

	protected getSessionId(socketOrSessionId: SocketOrSessionId) {
		const sessionId = typeof socketOrSessionId === 'string' ? socketOrSessionId : socketOrSessionId.session?.id;

		return sessionId;
	}

	protected getSocket(socketOrSessionId: SocketOrSessionId) {
		if (typeof socketOrSessionId !== 'string') {
			return socketOrSessionId;
		}

		const sockets = Array.from(this.server.clients.values()) as TypedWebSocket[];

		return sockets.find((socket) => socket.session?.id === socketOrSessionId);
	}

	broadcast(data: EventRouteOutput<unknown>) {
		const sockets = this.server.clients as unknown as TypedWebSocket[];

		sockets.forEach((socket) => {
			if (socket.readyState !== WebSocket.OPEN) {
				return;
			}

			this.sendData(socket, data);
		});
	}
}
