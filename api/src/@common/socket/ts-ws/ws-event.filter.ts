import { SocketService } from '$socket/socket.service';
import type { TypedWebSocket } from '$socket/types';
import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch(WsException, HttpException)
export class WsEventExceptionsFilter extends BaseWsExceptionFilter {
	constructor(private readonly socketService: SocketService) {
		super();
	}

	override catch(exception: WsException | HttpException, host: ArgumentsHost) {
		const client = host.switchToWs().getClient<TypedWebSocket>();

		const error = exception instanceof WsException ? exception.getError() : exception.getResponse();

		this.socketService.sendError(client, error);
	}
}
