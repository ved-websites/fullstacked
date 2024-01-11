import { Auth, LuciaFactory } from '$users/auth/lucia/lucia.factory';
import { COOKIE_NAME, setupSessionContainer, type SessionContainer } from '$users/auth/lucia/lucia.middleware';
import { parseCookies } from '$utils/cookies';
import { Inject, Injectable } from '@nestjs/common';
import type { IncomingMessage } from 'http';
import { Server, WebSocket } from 'ws';
import { EventRouteOutput, EventUID, RawEventRoute, extractEventRouteKey } from '~contract';
import { WsEventEmitter } from './ts-ws/ws-event.emitter';

export type TypedWebSocket = WebSocket & SessionContainer;
export type SocketOrSessionId = TypedWebSocket | string;

@Injectable()
export class SocketService {
	server!: Server;

	private static initializationMap = new Map<WebSocket, Promise<unknown>>();

	constructor(
		@Inject(LuciaFactory) private readonly auth: Auth,
		private readonly wsEmitter: WsEventEmitter,
	) {}

	onClientConnect(socket: TypedWebSocket, request: IncomingMessage) {
		const socketInit = this.initialize(socket, request);

		SocketService.initializationMap.set(socket, socketInit);

		return socketInit;
	}

	static async finishInitialization(socket: TypedWebSocket) {
		await SocketService.initializationMap.get(socket);
	}

	private async initialize(socket: TypedWebSocket, request: IncomingMessage) {
		const cookies = parseCookies(request.headers.cookie);

		const authSessionCookieToken = cookies[COOKIE_NAME] as string | undefined;
		const authSessionHeader = request.headers.authorization;

		let token = request.headers.authorization;

		if (authSessionCookieToken && !authSessionHeader) {
			token = `Bearer ${authSessionCookieToken}`;
		}

		await setupSessionContainer(socket, this.auth, token);

		SocketService.initializationMap.delete(socket);
	}

	onClientDisconnect(socket: TypedWebSocket) {
		console.log('hai from SocketService.onClientDisconnect!', socket.session?.user.email);
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

		return allSockets.filter((socket) => socket.session?.user.userId === userId);
	}

	flushUserSockets(userId: string) {
		const sockets = this.getSocketsOf(userId);

		sockets.forEach((socket) => {
			this.flush(socket);
		});
	}

	emit<E extends RawEventRoute>(event: E, data: E['emitted']) {
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
		const sessionId = typeof socketOrSessionId === 'string' ? socketOrSessionId : socketOrSessionId.sessionId;

		return sessionId;
	}

	protected getSocket(socketOrSessionId: SocketOrSessionId) {
		if (typeof socketOrSessionId !== 'string') {
			return socketOrSessionId;
		}

		const sockets = Array.from(this.server.clients.values()) as TypedWebSocket[];

		return sockets.find((socket) => socket.sessionId === socketOrSessionId);
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
