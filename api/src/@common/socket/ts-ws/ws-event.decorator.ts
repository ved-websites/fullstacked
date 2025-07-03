import env from '$configs';
import { AuthGuard } from '$users/auth/auth.guard';
import { RolesGuard } from '$users/auth/roles/roles.guard';
import { SetMetadata, UseFilters, UseGuards, UseInterceptors, applyDecorators } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { EventRoute, extractEventRouteKey } from '~contract';
import { WsEventExceptionsFilter } from './ws-event.filter';
import { WsEventInterceptor } from './ws-event.interceptor';

export const socketGuards = [AuthGuard, RolesGuard] as const;

export const EVENT_ROUTE_METADATA_KEY = '__ts-ws_wsEventRoute';

/**
 * Initialize event contract, and mark this method as a receiver.
 *
 * Using `tsWsHandler()` is not required, but could be used to hook into the outgoing messages.
 *
 * @example
 * // Simply initialize contract
 * ⁣@WsEventSub(wsR.messages.new)
 * chat() {}
 *
 * @example
 * // Log data whenever this event is sent
 * ⁣@WsEventSub(wsR.messages.new)
 * chat(@AuthUser() user: AppUser) {
 *   return tsWsHandler(wsR.messages.new, ({ data }) => {
 *     console.log(`User ${user.email} will receive :`, { data });
 *     return {};
 *   })
 * }
 *
 * @example
 * // Disconnect user if data (as string) contains 'no'
 * ⁣@WsEventSub(wsR.messages.new)
 * chat() {
 *   return tsWsHandler(wsR.messages.new, ({ data, socket }) => {
 *     if (data.includes('no')) {
 *       socket.close(WsStatusCodes.CLOSE_NORMAL);
 *       return;
 *     }
 *     return {};
 *   })
 * }
 */
export const WsEventSub = (event: EventRoute) => {
	const key = extractEventRouteKey(event);

	return applyDecorators(
		SetMetadata(EVENT_ROUTE_METADATA_KEY, event),
		SubscribeMessage(key),
		UseGuards(...socketGuards),
		UseInterceptors(WsEventInterceptor),
		UseFilters(WsEventExceptionsFilter),
	);
};

export const WsGateway = () => {
	return applyDecorators(
		WebSocketGateway({
			transports: ['websocket'],
			cors: {
				credentials: true,
				origin: env.CORS_LINKS,
			},
		}),
	);
};
