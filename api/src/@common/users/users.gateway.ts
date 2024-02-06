import { WsEventSub, WsGateway } from '$socket/ts-ws/ws-event.decorator';
import { z } from 'zod';
import { tsWsHandler, wsR } from '~contract';
import type { OptionalUserSpecifierSchema } from './users.contract';

@WsGateway()
export class UsersGateway {
	protected filterForSpecifier({ input, data }: { input: z.output<typeof OptionalUserSpecifierSchema>; data: { id?: string } }) {
		if (input.id && input.id !== data.id) {
			return;
		}

		return {};
	}

	@WsEventSub(wsR.users.edited)
	userEdited() {
		return tsWsHandler(wsR.users.edited, this.filterForSpecifier);
	}

	@WsEventSub(wsR.users.onlineChange)
	userOnlineChange() {
		return tsWsHandler(wsR.users.onlineChange, this.filterForSpecifier);
	}

	@WsEventSub(wsR.users.created)
	userCreated() {
		return tsWsHandler(wsR.users.created, this.filterForSpecifier);
	}

	@WsEventSub(wsR.users.deleted)
	userDeleted() {
		return tsWsHandler(wsR.users.deleted, this.filterForSpecifier);
	}
}
