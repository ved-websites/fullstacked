import { SocketService } from '$socket/socket.service';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import type { IncomingMessage } from 'http';
import { Server } from 'ws';
import { WsStatusCodes } from '~contract';
import { WsGateway } from './ts-ws/ws-event.decorator';
import type { TypedWebSocket } from './types';

@WsGateway()
export class MainGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(private socketService: SocketService) {}

	afterInit(server: Server) {
		this.socketService.server = server;
	}

	async handleConnection(socket: TypedWebSocket, ...args: [IncomingMessage, ...unknown[]]) {
		const [request] = args;

		await this.socketService.onClientConnect(socket, request);

		if (!socket.session) {
			this.socketService.sendError(socket, 'You are not connected!');

			socket.close(WsStatusCodes.UNAUTHORIZED);
		}
	}

	handleDisconnect(socket: TypedWebSocket) {
		this.socketService.onClientDisconnect(socket);
	}
}
