import { AuthGuard } from '$users/auth/auth.guard';
import { AuthModule } from '$users/auth/auth.module';
import { RolesGuard } from '$users/auth/roles/roles.guard';
import { RolesModule } from '$users/auth/roles/roles.module';
import { CanActivate, SetMetadata, UseFilters, UseGuards, UseInterceptors, applyDecorators } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import type { ClassConstructor } from 'class-transformer';
import { RawEventRoute, extractEventRouteKey } from '~contract';
import { WsEventExceptionsFilter } from './ws-event.filter';
import { WsEventInterceptor } from './ws-event.interceptor';

export type SocketDepType = {
	module: ClassConstructor<unknown>;
	guard: ClassConstructor<CanActivate>;
};

export const socketDependencies = [
	{
		module: AuthModule,
		guard: AuthGuard,
	},
	{
		module: RolesModule,
		guard: RolesGuard,
	},
] as const satisfies ReadonlyArray<SocketDepType>;

const socketGuards = socketDependencies.map((dep) => dep.guard);

export const EVENT_ROUTE_METADATA_KEY = '__wsEventRoute';

export const WsEventSub = (event: RawEventRoute) => {
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
		}),
	);
};
