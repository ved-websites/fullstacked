import type { ZodSchema, ZodType, z } from 'zod';

export type EventUID = string;

export type EventRouteDataCommon<T extends string = string> = {
	type: T;
	uid?: EventUID;
};

export type EventRouteSubscribeInput<E extends EventRouteConfig> = EventRouteDataCommon<'subscribe'> & {
	input: E['input'] extends ZodType ? z.output<E['input']> : undefined;
};
export type EventRouteUnsubscribeInput = EventRouteDataCommon<'unsubscribe'>;

export type EventRouteInput<E extends EventRouteConfig = EventRouteConfig> = EventRouteDataCommon &
	(EventRouteSubscribeInput<E> | EventRouteUnsubscribeInput);

export type EventRouteType = 'create' | 'update' | 'delete';

export type EventRouteOutput<T, O extends string = string> = EventRouteDataCommon<O> & {
	uid: EventUID | undefined;
	data: Prettify<T>;
};

export type EventRoute<C extends EventRouteConfig = EventRouteConfig> = C & {
	key: string;
};
export type EventRouteConfig = {
	type: EventRouteType;
	input?: ZodSchema;
	emitted: ZodSchema;
};

export type EventRouter = {
	[key: string]: EventRouteConfig | EventRouter;
};

function isBaseEventRouteConfig(obj: Record<string, unknown>) {
	return 'emitted' in obj && 'type' in obj;
}

export function isEventRouteConfig(obj: EventRouteConfig | EventRouter): obj is EventRouteConfig {
	return isBaseEventRouteConfig(obj) && !('key' in obj);
}

export function isEventRoute(obj: EventRouteConfig | EventRouter): obj is EventRoute {
	return isBaseEventRouteConfig(obj) && 'key' in obj;
}

export type PrettifyRouter<T> = {
	[K in keyof T]: T[K] extends EventRouter ? PrettifyRouter<T[K]> : T[K] extends EventRouteConfig ? Prettify<T[K]> : T[K];
} & unknown;
