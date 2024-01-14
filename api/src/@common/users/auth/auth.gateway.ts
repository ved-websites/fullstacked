import { WsEventSub, WsGateway } from '$socket/ts-ws/ws-event.decorator';
import { tsWsHandler, wsR } from '~contract';
import { AuthUser, LuciaUser } from './session.decorator';

@WsGateway()
export class AuthGateway {
	@WsEventSub(wsR.auth.update)
	handleMessage(@AuthUser() user: LuciaUser) {
		return tsWsHandler(wsR.auth.update, ({ data, input }) => {
			const onlySendThisEmail = input?.email ?? user.email;

			if (data.email !== onlySendThisEmail) {
				return;
			}

			return {};
		});
	}
}
