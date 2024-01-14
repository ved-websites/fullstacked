import { WsEventSub, WsGateway } from '$socket/ts-ws/ws-event.decorator';
import { AuthUser, LuciaUser } from '$users/auth/session.decorator';
import { Logger } from '@nestjs/common';
import { tsWsHandler, wsR } from '~contract';

@WsGateway()
export class MessageGateway {
	private readonly logger = new Logger(MessageGateway.name);

	@WsEventSub(wsR.messages.new)
	async chat(@AuthUser() user: LuciaUser) {
		// Code before the handler is run when the client sends any data through the event route key.

		this.logger.debug(`User subbed to chat : ${user.email}`);

		return tsWsHandler(wsR.messages.new, ({ data }) => {
			// Code here only runs on emitted event data.
			// You could use it to filter out unwanted events from being sent.

			this.logger.debug(`Chat Message sent to : ${user.email}`);

			// if (data.text.includes(input.closeOnIncludes)) {
			// 	socket.close(WsStatusCodes.CLOSE_NORMAL, 'Provided filter made you close the socket!');
			// 	return;
			// }

			return { data };
		});
	}
}
