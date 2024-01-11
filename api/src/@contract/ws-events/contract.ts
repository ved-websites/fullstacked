import { isEventRoute, isRawEventRoute, type EventRoute, type EventRouter, type RawEventRoute } from './eventRoute';

export function createEventContract() {
	return {
		type: <T>(): T extends undefined ? undefined : T => {
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

export function processEventRoute(obj: RawEventRoute | EventRouter, prevKey = '') {
	if (isRawEventRoute(obj)) {
		(obj as EventRoute).key = prevKey;

		return;
	}

	Object.entries(obj).forEach(([routerKey, eventRouteOrRouter]) => {
		const key = !prevKey ? routerKey : `${prevKey}.${routerKey}`;

		processEventRoute(eventRouteOrRouter, key);
	});
}

export function extractEventRouteKey(event: RawEventRoute) {
	if (!isEventRoute(event)) {
		throw new Error(`Event was not processed! Did you forget to use the 'masterRouter' method?`);
	}

	return event.key;
}
