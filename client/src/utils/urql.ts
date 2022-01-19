import { createClient, defaultExchanges, subscriptionExchange } from '@urql/svelte';
import { createClient as createWSClient } from 'graphql-ws';
import { getApiUrl } from '.';

const apiUrl = getApiUrl();

const wsProtocol = apiUrl.protocol == 'https:' ? 'wss' : 'ws';

const wsClient = createWSClient({
	url: `${wsProtocol}://${apiUrl.host}/graphql`,
});

export const client = createClient({
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
