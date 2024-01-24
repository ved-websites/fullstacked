import {
	isEventRoute,
	isEventRouteConfig,
	type EventRoute,
	type EventRouteConfig,
	type EventRouter,
	type PrettifyRouter,
} from './eventRoute';

export function createEventContract() {
	return {
		type: <T>(): T extends undefined ? undefined : T => {
			return undefined as never;
		},
		router: <TRouter extends EventRouter>(eventMap: TRouter) => {
			return eventMap;
		},
		masterRouter: <TRouter extends EventRouter>(eventMap: TRouter) => {
			const processedRouter = processEventRouter(eventMap);

			return processedRouter;
		},
	};
}

export function processEventRouter<TRouter extends EventRouter>(router: TRouter, prevKey = '') {
	type NestEventRouter<T extends EventRouter> = {
		[K in keyof T]: T[K] extends EventRouteConfig ? EventRoute<T[K]> : T[K] extends EventRouter ? NestEventRouter<T[K]> : T[K];
	};

	const processedRouter: PrettifyRouter<NestEventRouter<TRouter>> = Object.fromEntries(
		Object.entries(router).map(([key, subRouter]) => {
			const routeKey = prevKey ? `${prevKey}.${key}` : key;

			if (isEventRouteConfig(subRouter)) {
				const processedRoute = {
					...subRouter,
					key: routeKey,
				} satisfies EventRoute;

				return [key, processedRoute];
			} else {
				return [key, processEventRouter(subRouter, routeKey)];
			}
		}),
	);

	return processedRouter;
}

export function extractEventRouteKey(event: EventRouteConfig) {
	if (!isEventRoute(event)) {
		throw new Error(`Event route was not processed! Did you forget to use the 'masterRouter' method?`);
	}

	return event.key;
}
