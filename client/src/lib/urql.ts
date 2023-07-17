import type { RenewBearerTokenMutation, RenewBearerTokenMutationVariables } from '$/graphql/@generated';
import { browser } from '$app/environment';
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
import { sessionToken } from './stores';
import { getApiUrl } from './utils';
import { getValue, type ValueGetter } from './utils/typescript';

export type ClientOptions = {
	fetch?: typeof fetch;
	requestToken?: ValueGetter<string | null | undefined>;
	ws?: unknown;
};

export function createClient(options?: ClientOptions) {
	const apiUrl = getApiUrl();

	const wsProtocol = apiUrl.protocol == 'https:' ? 'wss' : 'ws';

	const wsClient = createWSClient({
		url: `${wsProtocol}://${apiUrl.host}/graphql`,
		webSocketImpl: options?.ws,
		connectionParams() {
			const authToken = getValue(options?.requestToken);

			if (!authToken) {
				return {};
			}

			return {
				Authorization: `Bearer ${authToken}`,
			};
		},
	});

	const urql = createURQLClient({
		url: `${apiUrl.origin}/graphql`,
		exchanges: [
			cacheExchange,
			authExchange(async (utils) => {
				return {
					addAuthToOperation(operation) {
						const authToken = getValue(options?.requestToken);

						if (!authToken) {
							return operation;
						}

						return utils.appendHeaders(operation, {
							Authorization: `Bearer ${authToken}`,
						});
					},
					didAuthError(error, _operation) {
						return error.graphQLErrors.some(
							(e) => e.extensions?.code === 'UNAUTHENTICATED' && e.message == 'Session is not active anymore!',
						);
					},
					async refreshAuth() {
						try {
							const { data } = await utils.mutate(
								gql<RenewBearerTokenMutation, RenewBearerTokenMutationVariables>`
									mutation RenewBearerToken {
										renewSession {
											accessToken
										}
									}
								`,
								{},
							);

							sessionToken.set(data?.renewSession?.accessToken ?? null);
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

	return urql;
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

	const urql = args.client ?? getContextClient();

	// @ts-expect-error Typing issues
	return urqlQueryStore({
		client: urql,
		...args,
	}) as Readable<Partial<OperationResultState<Data, Variables>> & { isServer?: never }>;
}

export function mutation<Data = unknown, Variables extends AnyVariables = AnyVariables>(
	query: DocumentInput<Data, Variables>,
	context?: Parameters<ReturnType<typeof getContextClient>['mutation']>[2] & { urql?: ReturnType<typeof getContextClient> },
) {
	if (!browser) {
		return () => {
			throw new Error('INTERNAL ERROR : Do not use mutation function on the server!');
		};
	}

	const urql = context?.urql ?? getContextClient();

	return (variables: Variables, requestContext?: typeof context) => {
		return urql.mutation<Data, Variables>(query, variables, requestContext ?? context).toPromise();
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

	const urql = args.client ?? getContextClient();

	return (variables: Parameters<typeof urqlMutationStore<Data, Variables>>[0]['variables']) => {
		// @ts-expect-error Typing issues
		return urqlMutationStore({
			client: urql,
			variables,
			...args,
		}) as Readable<OperationResultState<Data, Variables> & { isServer?: boolean }>;
	};
}

export type SubscribeOptions = Partial<{ urql: Client }>;

declare const subscription: Client['subscription'];
type SubscriptionParameters<Result, Variables extends AnyVariables> = Parameters<typeof subscription<Result, Variables>>;

export function subscribe<Result, Variables extends AnyVariables>(
	params: TypedDocumentNode<Result, { [key: string]: never }> | SubscriptionParameters<Result, Variables>,
	handler: (result: OperationResult<Result, Variables>) => Promise<unknown> | unknown,
	options?: SubscribeOptions,
) {
	if (!browser) {
		return;
	}

	const urql = options?.urql ?? getContextClient();

	const subArgs = (Array.isArray(params) ? params : [params, undefined]) as SubscriptionParameters<Result, Variables>;

	const { unsubscribe } = pipe(urql.subscription(...subArgs), wonkaSubscribe(handler));

	onDestroy(unsubscribe);
}
