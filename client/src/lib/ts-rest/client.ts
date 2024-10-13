import type { AppErrorBody } from '$app-types';
import type { PageMessages } from '$lib/types';
import { getApiUrl } from '$lib/utils';
import { r, tsRestFetcherApi, type ApiFetcherData, type CommonError } from '@app/contract';
import type { RequestEvent } from '@sveltejs/kit';
import { initClient, type ApiFetcherArgs } from '@ts-rest/core';
import { checkForApiErrors } from './errorHandler';

export type ErrorPageMessagesData = PageMessages | ((args: OnErrorFunctionArgs) => Awaitable<PageMessages>);

export type OnErrorFunctionArgs<T = unknown> = {
	/** The error message. Usually a stringified `data.body.message`, but could be other things depending on the error. */
	message: AppErrorBody;
	data: ApiFetcherData<T>;
	event?: RequestEvent;
};

export type ApiResponseHandlerOptions = {
	event?: RequestEvent;
	/**
	 * Set this to `false` to disable the auto-routing for non-common errors.
	 *
	 * @default true
	 */
	autoRouteOtherErrors?: boolean;
	/**
	 * Custom {@link PageMessages} data to show when handling errors that are not using the `+error.page`.
	 *
	 * Can be a pure object or an awaitable function that can use the event / data state to create the {@link PageMessages} data.
	 */
	errPageData?: ErrorPageMessagesData;
	/**
	 * Set this to `true` to render the `+error.svelte` when in the page context for BAD_REQUEST responses (http status code 400).
	 *
	 * @default false
	 */
	showErrorPageOnBadRequest?: boolean;
	/**
	 * Called before the BAD_REQUEST (http status code 400) error logic is handled.
	 *
	 * If this function returns a truthy value, the default error logic will be skipped ("it is true that the error has been handled").
	 */
	onBadRequest?: (args: OnErrorFunctionArgs<CommonError>) => Awaitable<unknown>;
	/**
	 * Called before the common error logic is handled.
	 *
	 * If this function returns a truthy value, the default error logic will be skipped ("it is true that the error has been handled").
	 */
	onCommonError?: (args: OnErrorFunctionArgs<CommonError>) => Awaitable<unknown>;
	/**
	 * Entirely skips the default error checking.
	 */
	skipErrorHandling?: boolean;
};

export function createTsRestClient(event?: RequestEvent) {
	const apiUrl = getApiUrl();

	const client = initClient(r, {
		baseUrl: apiUrl.href.slice(0, -1),
		baseHeaders: {},
		credentials: 'include',
		jsonQuery: true,
		api: async (args: ApiFetcherArgs & ApiResponseHandlerOptions) => {
			const data = await tsRestFetcherApi(args, event?.fetch ?? fetch);

			await checkForApiErrors(data, { event, ...args });

			return data;
		},
	});

	return client;
}

export type TsRestClient = ReturnType<typeof createTsRestClient>;
