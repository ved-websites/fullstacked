/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { ApiFetcherArgs } from '@ts-rest/core';

export type ApiFetcherData<Body = unknown> = {
	status: number;
	body: Body;
	headers: Headers;
};

export type ApiFetcher = (args: ApiFetcherArgs, fetcher: typeof fetch) => Promise<ApiFetcherData>;

export const tsRestFetcherApi: ApiFetcher = async ({ path, method, headers, body, credentials, signal, cache, next, route }, fetcher) => {
	const result = await fetcher(path, {
		method,
		headers,
		body,
		credentials,
		signal,
		// @ts-ignore
		cache,
		// @ts-ignore
		next,
	});
	const contentType = result.headers.get('content-type');

	if (
		(contentType === null || contentType === void 0 ? void 0 : contentType.includes('application/')) &&
		(contentType === null || contentType === void 0 ? void 0 : contentType.includes('json'))
	) {
		if (!route.validateResponseOnClient) {
			return {
				status: result.status,
				body: await result.json(),
				headers: result.headers,
			};
		}
		const jsonData = await result.json();
		const statusCode = result.status;
		const response = route.responses[statusCode];

		return {
			status: statusCode,
			body:
				response && typeof response !== 'symbol' && 'parse' in response
					? response === null || response === void 0
						? void 0
						: response.parse(jsonData)
					: jsonData,
			headers: result.headers,
		};
	}
	if (contentType === null || contentType === void 0 ? void 0 : contentType.includes('text/')) {
		return {
			status: result.status,
			body: await result.text(),
			headers: result.headers,
		};
	}
	return {
		status: result.status,
		body: await result.blob(),
		headers: result.headers,
	};
};
