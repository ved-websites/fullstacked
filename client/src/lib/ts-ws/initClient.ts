import { browser, dev } from '$app/environment';
import SuperSocket from '@shippr/supersocket';
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

function initRoute<TRoute extends EventRoute>(route: TRoute, socket: KitSocket | undefined) {
	if (!socket) {
		return () => {
			return () => {
				// servers should not connect to websocket, only clients
			};
		};
	}

	/**
	 * Subscribes to the given event.
	 *
	 * When called on component initialization, it will handle the unsubscription automatically, but
	 * otherwise, you will need to handle it yourself by using the returned unsubscriber function.
	 */
	return (...args: RouteArgs<TRoute>) => {
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
				throw error;
			}
		}

		return unsubscriber;
	};
}

class KitSocket extends SuperSocket {
	protected subscriptionMap = new Map<EventUID | undefined, SubscriptionEventValue>();

	constructor(...args: ConstructorParameters<typeof SuperSocket>) {
		super(...args);

		this.onopen = () => {
			this.subscriptionMap.forEach((subscription) => {
				try {
					this.send(subscription.subscriptionRequest);
				} catch (error) {
					// sending error, do nothing and wait for retry
				}
			});
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
			if (event.code === WsStatusCodes.CLOSE_ABNORMAL) {
				this.connect();
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

		const OPEN_STATE = 1;

		if (this.readyState === OPEN_STATE) {
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
	protected generateUid(length = 7) {
		// eslint-disable-next-line @typescript-eslint/no-magic-numbers
		return (Math.random() + 1).toString(36).substring(length);
	}
}

export function initClient<TRouter extends EventRouter>(
	router: TRouter,
	args: {
		url: string;
		socket?: KitSocket;
	},
) {
	type ClientEventRouter<T extends EventRouter> = {
		[K in keyof T]: T[K] extends EventRoute
			? ReturnType<typeof initRoute<T[K]>>
			: T[K] extends EventRouter
			  ? ClientEventRouter<T[K]>
			  : unknown;
	};

	const socket = (() => {
		if (!browser) {
			return undefined;
		}

		if (args.socket) {
			return args.socket;
		}

		return new KitSocket(args.url, [], {
			secureOnly: !dev,
			reconnectDelay: 1000 * 1000,
		});
	})();

	const processedRouter: PrettifyRouter<ClientEventRouter<TRouter>> = Object.fromEntries(
		Object.entries(router).map(([key, subRouter]) => {
			// const routeKey = prevKey ? `${prevKey}.${key}` : key;

			if (isEventRoute(subRouter)) {
				return [key, initRoute(subRouter, socket)];
			} else if (isEventRouteConfig(subRouter)) {
				throw new Error(`Event route was not processed! Did you forget to use the 'masterRouter' method?`);
			} else {
				return [key, initClient(subRouter, { ...args, socket: socket })];
			}
		}),
	);

	return {
		$socket: socket as KitSocket,
		...processedRouter,
	};
}
