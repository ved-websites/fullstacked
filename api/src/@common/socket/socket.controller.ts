import { AuthSession, AuthUser, LuciaSession, LuciaUser } from '$users/auth/session.decorator';
import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SocketService } from './socket.service';

@Controller()
export class SocketController {
	constructor(private readonly socketService: SocketService) {}

	@Post('/ws-handshake')
	@HttpCode(HttpStatus.OK)
	async wsHandshake(
		@AuthSession() session: LuciaSession | null,
		@AuthUser() user: LuciaUser | null,
		@Body('token') token: string | undefined,
	) {
		if (!user || !session) {
			throw new BadRequestException('You need to be logged in to access the websocket endpoint!');
		}

		if (!token) {
			throw new BadRequestException('No token!');
		}

		this.socketService.addHandshake(token, { session, user });
	}
}
