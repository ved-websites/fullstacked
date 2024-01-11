import type { ZodSchema, ZodType, z } from 'zod';
import type { TypedWebSocket } from '../../@common/socket/socket.service';

// TODO : Split this up into different files

export type ContractNullType = null;
export type ContractPlainType<T> = T;
export type ContractAnyType = ZodSchema | ContractNullType | ContractPlainType<unknown>;

export type EventUID = string;

export type EventRouteDataCommon<T extends string = string> = {
	type: T;
	uid?: EventUID;
};

export type EventRouteSubscribeInput<E extends EventRoute> = EventRouteDataCommon<'subscribe'> & {
	input: E['input'] extends ZodType ? z.output<E['input']> : undefined;
};
export type EventRouteUnsubscribeInput = EventRouteDataCommon<'unsubscribe'>;

export type EventRouteInput<E extends EventRoute = EventRoute> = EventRouteDataCommon &
	(EventRouteSubscribeInput<E> | EventRouteUnsubscribeInput);

export type EventRouteType = 'create' | 'update' | 'delete';

export type EventRouteOutput<T, O extends string = string> = EventRouteDataCommon<O> & {
	uid: EventUID | undefined;
	data: T;
};

export type RouteEventHandler<E extends EventRoute = EventRoute> = (
	event: Omit<EventRouteInput<E>, 'data'> & {
		socket: TypedWebSocket;
		data: E['emitted'];
		input: E['input'] extends ZodType ? z.output<E['input']> : undefined;
	},
) => Awaitable<Partial<Omit<EventRouteOutput<E['emitted']>, 'type'>> | undefined | void>;

export function handleWsEvent<E extends EventRoute>(event: E, implementation: RouteEventHandler<E>) {
	return implementation;
}

export type EventRoute = {
	type: EventRouteType;
	input?: ZodSchema;
	emitted: unknown;
};
export type ProcessedEventRoute = EventRoute & {
	key: string;
};

export type EventRouter = {
	[key: string]: EventRoute | EventRouter;
};

export function isEventRoute(obj: EventRoute | EventRouter): obj is EventRoute {
	return 'emitted' in obj;
}

export function isProcessedEventRoute(obj: EventRoute): obj is ProcessedEventRoute {
	return 'key' in obj;
}

export function createEventContract() {
	return {
		type: <T>(): T extends undefined ? undefined : ContractPlainType<T> => {
			return undefined as never;
		},
		router: <TRouter extends EventRouter>(eventMap: TRouter): TRouter => {
			return eventMap;
		},
		masterRouter: <TRouter extends EventRouter>(eventMap: TRouter): TRouter => {
			processEventRoute(eventMap);

			return eventMap;
		},
	};
}

export function processEventRoute(obj: EventRoute | EventRouter, prevKey = '') {
	if (isEventRoute(obj)) {
		(obj as ProcessedEventRoute).key = prevKey;

		return;
	}

	Object.entries(obj).forEach(([routerKey, eventRouteOrRouter]) => {
		const key = !prevKey ? routerKey : `${prevKey}.${routerKey}`;

		processEventRoute(eventRouteOrRouter, key);
	});
}

export function extractEventRouteKey(event: EventRoute) {
	if (!isProcessedEventRoute(event)) {
		throw new Error(`Event was not processed! Did you forget to use the 'masterRouter' method?`);
	}

	return event.key;
}

export const WsStatusCodes = {
	CLOSE_NORMAL: 1000,
	CLOSED_NO_STATUS: 1005,
	CLOSE_ABNORMAL: 1006,
	UNAUTHORIZED: 4001,
	FORBIDDEN: 4003,
} as const;
