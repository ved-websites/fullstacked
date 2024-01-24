import { WsEventSub, WsGateway } from '$socket/ts-ws/ws-event.decorator';
import { z } from 'zod';
import { tsWsHandler, wsR } from '~contract';
import type { OptionalEmailSpecifierSchema } from './users.contract';

@WsGateway()
export class UsersGateway {
	protected filterForEmailSpecifier({ input, data }: { input: z.output<typeof OptionalEmailSpecifierSchema>; data: { email: string } }) {
		if (input.email && input.email !== data.email) {
			return;
		}

		return {};
	}

	@WsEventSub(wsR.users.edited)
	userEdited() {
		return tsWsHandler(wsR.users.edited, this.filterForEmailSpecifier);
	}

	@WsEventSub(wsR.users.onlineChange)
	userOnlineChange() {
		return tsWsHandler(wsR.users.onlineChange, this.filterForEmailSpecifier);
	}

	@WsEventSub(wsR.users.created)
	userCreated() {
		return tsWsHandler(wsR.users.created, this.filterForEmailSpecifier);
	}
	@WsEventSub(wsR.users.deleted)
	userDeleted() {
		return tsWsHandler(wsR.users.deleted, this.filterForEmailSpecifier);
	}
}
