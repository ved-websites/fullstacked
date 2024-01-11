import type { ZodType, z } from 'zod';
import type { TypedWebSocket } from '../../@common/socket/types';
import type { EventRouteInput, EventRouteOutput, RawEventRoute } from './eventRoute';

export type RouteEventHandler<E extends RawEventRoute = RawEventRoute> = (
	event: Omit<EventRouteInput<E>, 'data'> & {
		socket: TypedWebSocket;
		data: E['emitted'];
		input: E['input'] extends ZodType ? z.output<E['input']> : undefined;
	},
) => Awaitable<Partial<Omit<EventRouteOutput<E['emitted']>, 'type'>> | undefined | void>;

export function handleWsEvent<E extends RawEventRoute>(event: E, implementation: RouteEventHandler<E>) {
	return implementation;
}
