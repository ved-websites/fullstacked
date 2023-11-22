/* eslint-disable @typescript-eslint/no-explicit-any */

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
		// @ts-expect-error oh yeah btw `infer D extends any` doesn't work, love it
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

/**
 * Easily subscribes to the SubscriptionStore provided.
 *
 * This function handles unsubscriptions automatically when called in the
 * component initialization, but otherwise you need to handle the returned
 * unsubscriber yourself.
 */
export function subscribe<T extends new (...args: never[]) => SubscriptionStore<any, any>>(
	storeData: [T, ...Parameters<InstanceType<T>['listen']>],
	...params: Parameters<InstanceType<T>['subscribe']>
) {
	if (!browser) {
		return () => {
			// Do nothing when not on browser
		};
	}

	const [store, ...storeListenParams] = storeData;

	const storeInstance = new store();

	let unsubscriber: ReturnType<(typeof storeInstance)['subscribe']>;

	// NEED TO ADD VARIABLES TO LISTEN METHOD
	storeInstance.listen(...storeListenParams).then(() => {
		// @ts-expect-error TS no likey rest Parameters
		unsubscriber = storeInstance.subscribe(...params);
	});

	const unsubscribe = () => {
		unsubscriber?.();
		storeInstance.unlisten();
	};

	try {
		onDestroy(() => {
			unsubscribe();
		});
	} catch (error) {
		// Do nothing on error, that is probably called outside component initialization
	}

	return unsubscribe;
}
