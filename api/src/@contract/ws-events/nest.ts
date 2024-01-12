import type { ZodType, z } from 'zod';
import type { TypedWebSocket } from '../../@common/socket/types';
import type { EventRoute, EventRouteConfig, EventRouteInput, EventRouteOutput } from './eventRoute';

export type RouteEventHandler<E extends EventRouteConfig = EventRouteConfig> = (
	event: Omit<EventRouteInput<E>, 'data' | 'type'> & {
		socket: TypedWebSocket;
		data: E['emitted'];
		input: E['input'] extends ZodType ? z.output<E['input']> : undefined;
	},
) => Awaitable<Partial<Omit<EventRouteOutput<E['emitted']>, 'type'>> | undefined | void>;

/**
 * Allows to easily manipulate individual transmitted events.
 *
 * Returning any falsy values will prevent that message from being sent to the subscriber.
 * Simply `return {};` in the implementation and the original data will be sent.
 *
 * @example Filter messages through given inputs.
 * @example Manipulate (disconnect) socket when certain data is met.
 */
export function tsWsHandler<E extends EventRoute>(_event: E, implementation: RouteEventHandler<E>) {
	return implementation;
}
