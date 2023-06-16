import { browser } from '$app/environment';
import {
	Client,
	cacheExchange,
	createClient as createURQLClient,
	fetchExchange,
	getContextClient,
	subscriptionExchange,
	type AnyVariables,
	type OperationResult,
	type TypedDocumentNode,
} from '@urql/svelte';
import { createClient as createWSClient } from 'graphql-ws';
import { onDestroy } from 'svelte';
import { pipe, subscribe as wonkaSubscribe } from 'wonka';
import { getApiUrl } from './utils';

export function createClient() {
	const apiUrl = getApiUrl();

	const wsProtocol = apiUrl.protocol == 'https:' ? 'wss' : 'ws';

	const wsClient = createWSClient({
		url: `${wsProtocol}://${apiUrl.host}/graphql`,
	});

	const client = createURQLClient({
		url: `${apiUrl.origin}/graphql`,
		exchanges: [
			cacheExchange,
			fetchExchange,
			subscriptionExchange({
				forwardSubscription(request) {
					const input = { ...request, query: request.query || '' };

					return {
						subscribe(sink) {
							const unsubscribe = wsClient.subscribe(input, sink);

							return { unsubscribe };
						},
					};
				},
			}),
		],
	});

	return client;
}

export type SubscribeOptions = Partial<{ client: Client }>;

export function subscribe<Result, Variables extends AnyVariables>(
	params: TypedDocumentNode<Result, { [key: string]: never }> | [TypedDocumentNode<Result, Variables>, Variables],
	handler: (result: OperationResult<Result, Variables>) => Promise<unknown> | unknown,
	options?: SubscribeOptions,
) {
	if (!browser) {
		return;
	}

	const client = options?.client ?? getContextClient();

	const subArgs = Array.isArray(params) ? params : ([params, undefined] as [TypedDocumentNode<Result, Variables>, Variables]);

	const { unsubscribe } = pipe(client.subscription(...subArgs), wonkaSubscribe(handler));

	onDestroy(unsubscribe);
}
