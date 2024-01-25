import { browser, dev } from '$app/environment';
import SuperSocket from '@shippr/supersocket';
import type { CloseEvent as SuperSocketCloseEvent, Event as SuperSocketEvent } from '@shippr/supersocket/lib/esm/types/events';
import { onDestroy } from 'svelte';
import type { ZodType, z } from 'zod';
import {
	WsStatusCodes,
	isEventRoute,
	isEventRouteConfig,
	type EventRoute,
	type EventRouteOutput,
	type EventRouter,
	type EventUID,
	type NestWsIncomingMessage,
	type PrettifyRouter,
} from '~contract';
import { WS_READY_STATES } from './readyStates';

export type SubscriptionEventValue<TRoute extends EventRoute = EventRoute> = {
	subscriptionRequest: NestWsIncomingMessage<TRoute>;
	subscriber: (args: { data: z.output<TRoute['emitted']> }) => Awaitable<unknown>;
};

type FullRouteArgs<I extends ZodType, TRoute extends EventRoute> = [
	input: z.output<I>,
	subscriber: SubscriptionEventValue<TRoute>['subscriber'],
];
type RouteArgs<TRoute extends EventRoute> = TRoute['input'] extends ZodType
	? FullRouteArgs<TRoute['input'], TRoute>
	: [subscriber: SubscriptionEventValue<TRoute>['subscriber']];

type ClientEventRouter<T extends EventRouter> = {
	[K in keyof T]: T[K] extends EventRoute
		? ReturnType<typeof initRoute<T[K]>>
		: T[K] extends EventRouter
			? ClientEventRouter<T[K]>
			: unknown;
};

function initRoute<TRoute extends EventRoute>(route: TRoute, socket: KitSocket) {
	/**
	 * Subscribes to the given event.
	 *
	 * When called on component initialization, it will handle the unsubscription automatically, but
	 * otherwise, you will need to handle it yourself by using the returned unsubscriber function.
	 */
	return (...args: RouteArgs<TRoute>) => {
		if (!browser) {
			return () => {
				// servers should not connect to websocket, only clients
			};
		}

		const [input, subscriber] = (typeof args[0] === 'function' ? [undefined, args[0]] : args) as FullRouteArgs<
			TRoute['input'] extends ZodType ? TRoute['input'] : never,
			TRoute
		>;

		const unsubscriber = socket.subscribeToEvent(route, { input, subscriber });

		try {
			onDestroy(() => {
				unsubscriber();
			});
		} catch (error) {
			if (error instanceof Error && error.message !== 'Function called outside component initialization') {
				console.error('An unexpected error happened!', error.message);
			}
		}

		return unsubscriber;
	};
}

class KitSocket extends SuperSocket {
	protected subscriptionMap = new Map<EventUID | undefined, SubscriptionEventValue>();

	public onConnChange:
		| null
		| ((event: (SuperSocketEvent & { type: 'open' }) | (SuperSocketCloseEvent & { type: 'close' })) => Awaitable<unknown>) = null;

	constructor(...args: ConstructorParameters<typeof SuperSocket>) {
		super(...args);

		this.onopen = (event) => {
			this.subscriptionMap.forEach((subscription) => {
				try {
					this.send(subscription.subscriptionRequest);
				} catch (error) {
					// sending error, do nothing and wait for retry
				}
			});

			this.onConnChange?.(event as SuperSocketEvent & { type: 'open' });
		};

		function dataIsEventRouteOutput(data: unknown): data is EventRouteOutput<unknown> {
			return !!data && typeof data === 'object' && 'data' in data && 'type' in data && 'uid' in data;
		}

		this.onmessage = ({ data: rawData }) => {
			const parsedData = typeof rawData === 'string' ? JSON.parse(rawData) : {};

			if (!dataIsEventRouteOutput(parsedData)) {
				return;
			}

			const { data, uid } = parsedData;

			const subscriptionEventValue = this.subscriptionMap.get(uid);

			if (!subscriptionEventValue) {
				return;
			}

			subscriptionEventValue.subscriber({ data });
		};

		this.onclose = (event) => {
			this.onConnChange?.(event as SuperSocketCloseEvent & { type: 'close' });

			if (event.code === WsStatusCodes.CLOSE_ABNORMAL) {
				return true;
			} else if (event.code === WsStatusCodes.FORBIDDEN || event.code === WsStatusCodes.UNAUTHORIZED) {
				return false;
			}

			if (event.code === WsStatusCodes.CLOSE_NORMAL && event.reason === 'disconnecting') {
				return false;
			}
		};
	}

	subscribeToEvent<TRoute extends EventRoute>(
		route: TRoute,
		args: {
			input: TRoute['input'] extends ZodType ? z.output<TRoute['input']> : undefined;
			subscriber: SubscriptionEventValue<TRoute>['subscriber'];
		},
	) {
		const uid = this.generateUid();

		const subscriptionRequest: NestWsIncomingMessage<TRoute> = {
			event: route.key,
			data: {
				type: 'subscribe',
				uid,
				input: args.input,
			},
		};

		const subscriptionValue: SubscriptionEventValue = {
			subscriptionRequest,
			subscriber: args.subscriber,
		};

		this.subscriptionMap.set(uid, subscriptionValue);

		if (this.readyState === WS_READY_STATES.OPEN) {
			this.send(subscriptionValue.subscriptionRequest);
		}

		return () => {
			try {
				this.send({
					event: route.key,
					data: {
						type: 'unsubscribe',
						uid,
					},
				});
			} catch (error) {
				console.error(error);
			} finally {
				this.subscriptionMap.delete(uid);
			}
		};
	}

	override send<TRoute extends EventRoute>(data: NestWsIncomingMessage<TRoute>): void {
		return super.send(data);
	}

	hasSubscription(uid: EventUID | undefined) {
		return this.subscriptionMap.has(uid);
	}

	// eslint-disable-next-line @typescript-eslint/no-magic-numbers
	protected generateUid(length = 8) {
		// eslint-disable-next-line @typescript-eslint/no-magic-numbers
		return [...Array(length)].map(() => Math.random().toString(36)[2]).join('');
	}
}

function initRouter<TRouter extends EventRouter>(router: TRouter, socket: KitSocket) {
	const processedRouter: PrettifyRouter<ClientEventRouter<TRouter>> = Object.fromEntries(
		Object.entries(router).map(([key, subRouter]) => {
			if (isEventRoute(subRouter)) {
				return [key, initRoute(subRouter, socket)];
			} else if (isEventRouteConfig(subRouter)) {
				throw new Error(`Event route was not processed! Did you forget to use the 'masterRouter' method?`);
			} else {
				return [key, initRouter(subRouter, socket)];
			}
		}),
	);

	return processedRouter;
}

export function initClient<TRouter extends EventRouter>(
	router: TRouter,
	args: {
		url: string;
	},
) {
	const $socket = new KitSocket(args.url, [], {
		secureOnly: !dev,
		pingInterval: 30000,
		lazy: true,
		pingData: {
			event: 'ping',
		} satisfies NestWsIncomingMessage,
	});

	const processedRouter = initRouter(router, $socket);

	return {
		$socket,
		...processedRouter,
	} as { $socket: KitSocket } & typeof processedRouter;
}
