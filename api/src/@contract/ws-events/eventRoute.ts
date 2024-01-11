import type { ZodSchema, ZodType, z } from 'zod';

export type EventUID = string;

export type EventRouteDataCommon<T extends string = string> = {
	type: T;
	uid?: EventUID;
};

export type EventRouteSubscribeInput<E extends RawEventRoute> = EventRouteDataCommon<'subscribe'> & {
	input: E['input'] extends ZodType ? z.output<E['input']> : undefined;
};
export type EventRouteUnsubscribeInput = EventRouteDataCommon<'unsubscribe'>;

export type EventRouteInput<E extends RawEventRoute = RawEventRoute> = EventRouteDataCommon &
	(EventRouteSubscribeInput<E> | EventRouteUnsubscribeInput);

export type EventRouteType = 'create' | 'update' | 'delete';

export type EventRouteOutput<T, O extends string = string> = EventRouteDataCommon<O> & {
	uid: EventUID | undefined;
	data: T;
};

export type RawEventRoute = {
	type: EventRouteType;
	input?: ZodSchema;
	emitted: unknown;
};
export type EventRoute = RawEventRoute & {
	key: string;
};

export type EventRouter<R extends RawEventRoute = RawEventRoute> = {
	[key: string]: R | EventRouter;
};

export function isRawEventRoute(obj: RawEventRoute | EventRouter): obj is RawEventRoute {
	return 'emitted' in obj;
}

export function isEventRoute(obj: RawEventRoute): obj is EventRoute {
	return 'key' in obj;
}
