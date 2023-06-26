import type { RenewBearerTokenMutation, RenewBearerTokenMutationVariables } from '$/graphql/@generated';
import { browser } from '$app/environment';
import type { MaybePromise } from '@sveltejs/kit';
import { authExchange } from '@urql/exchange-auth';
import {
	Client,
	cacheExchange,
	createClient as createURQLClient,
	fetchExchange,
	getContextClient,
	gql,
	subscriptionExchange,
	mutationStore as urqlMutationStore,
	queryStore as urqlQueryStore,
	type AnyVariables,
	type DocumentInput,
	type OperationResult,
	type OperationResultState,
	type TypedDocumentNode,
} from '@urql/svelte';
import { createClient as createWSClient } from 'graphql-ws';
import { onDestroy } from 'svelte';
import { readable, type Readable } from 'svelte/store';
import { pipe, subscribe as wonkaSubscribe } from 'wonka';
import { getApiUrl } from './utils';

export type ClientOptions = {
	fetch?: typeof fetch;
	requestToken?: string | null | (() => MaybePromise<string | undefined | null>);
	ws?: unknown;
};

export function createClient(options?: ClientOptions) {
	const apiUrl = getApiUrl();

	const wsProtocol = apiUrl.protocol == 'https:' ? 'wss' : 'ws';

	const wsClient = createWSClient({
		url: `${wsProtocol}://${apiUrl.host}/graphql`,
		webSocketImpl: options?.ws,
	});

	const client = createURQLClient({
		url: `${apiUrl.origin}/graphql`,
		exchanges: [
			cacheExchange,
			authExchange(async (utils) => {
				return {
					addAuthToOperation(operation) {
						return operation;
					},
					didAuthError(error, _operation) {
						return error.graphQLErrors.some(
							(e) => e.extensions?.code === 'UNAUTHENTICATED' && e.message == 'Session is not active anymore!',
						);
					},
					async refreshAuth() {
						try {
							await utils.mutate(
								gql<RenewBearerTokenMutation, RenewBearerTokenMutationVariables>`
									mutation RenewBearerToken {
										renewSession {
											accessToken
										}
									}
								`,
								{},
							);
						} catch (error) {
							// Renew token failed, ah well
						}
					},
				};
			}),
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
		fetch: options?.fetch,
		fetchOptions: {
			credentials: 'include',
		},
	});

	return client;
}

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export function queryStore<Data = unknown, Variables extends AnyVariables = AnyVariables>(
	args: Optional<Parameters<typeof urqlQueryStore<Data, Variables>>[0], 'client'>,
) {
	if (!browser) {
		return readable({
			fetching: true,
			isServer: true,
		}) as Readable<OperationResultState<Data, Variables> & { isServer: true }>;
	}

	// @ts-expect-error Typing issues
	return urqlQueryStore({
		client: args.client ?? getContextClient(),
		...args,
	}) as Readable<OperationResultState<Data, Variables> & { isServer?: boolean }>;
}

export function mutation<Data = unknown, Variables extends AnyVariables = AnyVariables>(
	query: DocumentInput<Data, Variables>,
	context?: Parameters<ReturnType<typeof getContextClient>['mutation']>[2] & { client?: ReturnType<typeof getContextClient> },
) {
	if (!browser) {
		return () => {
			return;
		};
	}

	const client = context?.client ?? getContextClient();

	return (variables: Variables, requestContext?: typeof context) => {
		return client.mutation<Data, Variables>(query, variables, requestContext ?? context).toPromise();
	};
}

export function mutationStore<Data = unknown, Variables extends AnyVariables = AnyVariables>(
	args: Omit<Optional<Parameters<typeof urqlMutationStore<Data, Variables>>[0], 'client'>, 'variables'>,
) {
	if (!browser) {
		return () => {
			return readable({
				fetching: true,
				isServer: true,
			}) as Readable<OperationResultState<Data, Variables> & { isServer: true }>;
		};
	}

	const client = args.client ?? getContextClient();

	return (variables: Parameters<typeof urqlMutationStore<Data, Variables>>[0]['variables']) => {
		// @ts-expect-error Typing issues
		return urqlMutationStore({
			client,
			variables,
			...args,
		}) as Readable<OperationResultState<Data, Variables> & { isServer?: boolean }>;
	};
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
