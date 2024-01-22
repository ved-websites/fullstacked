import { WsEventSub, WsGateway } from '$socket/ts-ws/ws-event.decorator';
import { tsWsHandler, wsR } from '~contract';

@WsGateway()
export class UsersGateway {
	@WsEventSub(wsR.users.edited)
	userEdited() {
		return tsWsHandler(wsR.users.edited, ({ input, data }) => {
			if (input?.email && input.email !== data.email) {
				return;
			}

			return {};
		});
	}

	@WsEventSub(wsR.users.onlineChange)
	userOnlineChange() {
		return tsWsHandler(wsR.users.onlineChange, ({ input, data }) => {
			if (input?.email && input.email !== data.email) {
				return;
			}

			return {};
		});
	}
}
