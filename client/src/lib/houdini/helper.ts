/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { browser } from '$app/environment';
import { MutationStore, QueryStore, type QueryResult, type SubscriptionStore } from '$houdini';
import type { RequestEvent } from '@sveltejs/kit';
import { onDestroy } from 'svelte';
import { handleHoudiniErrors, type GraphQLOperationResult } from './errorHandler';

export type GraphQLQuery = <T extends (new (...args: never[]) => QueryStore<any, any>) | QueryStore<any, any>>(
	store: T,
	...options: Parameters<(T extends QueryStore<any, any> ? T : T extends new () => QueryStore<any, any> ? InstanceType<T> : never)['fetch']>
) => Promise<
	GraphQLOperationResult<
		// @ts-ignore oh yeah btw `infer D extends any` doesn't work, love it
		T extends new () => QueryStore<infer D extends any, any> ? D : T extends QueryStore<infer D extends any, any> ? D : never
	>
>;

export type GraphQLMutate = <T extends (new (...args: never[]) => MutationStore<any, any, any>) | MutationStore<any, any, any>>(
	store: T,
	...options: Parameters<
		(T extends MutationStore<any, any, any> ? T : T extends new () => MutationStore<any, any, any> ? InstanceType<T> : never)['mutate']
	>
) => Promise<
	GraphQLOperationResult<T extends MutationStore<infer D, any, any> ? D : T extends new () => MutationStore<infer D, any, any> ? D : never>
>;

export function createHoudiniHelpers(event: RequestEvent) {
	const query = (async (store, ...options) => {
		const [params] = options;

		const gqlStore = store instanceof QueryStore ? store : new (store as new () => QueryStore<any, any>)();

		const result = (await gqlStore.fetch({ event, fetch: event.fetch, ...(params ?? {}) })) as QueryResult;

		return handleHoudiniErrors(event, result);
	}) as GraphQLQuery;

	const mutate = (async (store, ...options) => {
		const [variables, params] = options;

		const gqlStore = store instanceof MutationStore ? store : new (store as new () => MutationStore<any, any, any>)();

		const result = (await gqlStore.mutate(variables, { event, fetch: event.fetch, ...(params ?? {}) })) as QueryResult;

		return handleHoudiniErrors(event, result);
	}) as GraphQLMutate;

	return {
		query,
		mutate,
	};
}

export function subscribe<T extends new (...args: never[]) => SubscriptionStore<any, any>>(
	store: T,
	...params: Parameters<InstanceType<T>['subscribe']>
) {
	if (!browser) {
		return;
	}

	const storeInstance = new store();

	let unsubscriber: () => void;

	storeInstance.listen().then(() => {
		// @ts-expect-error TS no likey rest Parameters
		unsubscriber = storeInstance.subscribe(...params);
	});

	onDestroy(() => {
		storeInstance.unlisten().then(() => {
			unsubscriber?.();
		});
	});
}
