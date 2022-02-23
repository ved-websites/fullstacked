import { browser } from '$app/env';
import {
	Client,
	createClient as createURQLClient,
	defaultExchanges,
	getClient,
	OperationResult,
	subscriptionExchange,
	TypedDocumentNode,
} from '@urql/svelte';
import { createClient as createWSClient } from 'graphql-ws';
import { onDestroy } from 'svelte';
import { pipe, subscribe as wonkaSubscribe } from 'wonka';
import { getApiUrl } from '.';

export function createClient() {
	const apiUrl = getApiUrl();

	const wsProtocol = apiUrl.protocol == 'https:' ? 'wss' : 'ws';

	const wsClient = createWSClient({
		url: `${wsProtocol}://${apiUrl.host}/graphql`,
	});

	const client = createURQLClient({
		url: `${apiUrl.origin}/graphql`,
		exchanges: [
			...defaultExchanges,
			subscriptionExchange({
				forwardSubscription: (operation) => ({
					subscribe: (sink) => ({
						unsubscribe: wsClient.subscribe(operation, sink),
					}),
				}),
			}),
		],
	});

	return client;
}

export type SubscribeOptions = Partial<{ client: Client }>;

export function subscribe<Result, Variables extends object = {}>(
	node: TypedDocumentNode<Result, Variables>,
	handler: (result: OperationResult<Result, Variables>) => Promise<unknown> | unknown,
	options?: SubscribeOptions,
) {
	if (!browser) {
		return;
	}

	const client = options?.client ?? getClient();

	const { unsubscribe } = pipe(client.subscription(node), wonkaSubscribe(handler));

	onDestroy(unsubscribe);
}
