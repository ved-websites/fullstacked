import { WsEventSub, WsGateway } from '$socket/ts-ws/ws-event.decorator';
import { tsWsHandler, wsR } from '~contract';
import { AuthUser, LuciaUser } from './session.decorator';

@WsGateway()
export class AuthGateway {
	@WsEventSub(wsR.auth.session)
	handleSessionUpdate(@AuthUser() user: LuciaUser) {
		return tsWsHandler(wsR.auth.session, ({ data }) => {
			if (data.email !== user.email) {
				return;
			}

			return {};
		});
	}
}
