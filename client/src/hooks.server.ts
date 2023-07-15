import { PUBLIC_API_ADDR } from '$env/static/public';
import { createClient } from '$lib/urql';
import type { Handle, HandleFetch } from '@sveltejs/kit';
import type { Client } from '@urql/svelte';
import { parseString } from 'set-cookie-parser';
import ws from 'ws';
import { GetUserFromSessionDocument } from './graphql/@generated';
import { AUTH_COOKIE_NAME } from './lib/utils/auth';

export async function getAuthUser(urql: Client) {
	const result = await urql.query(GetUserFromSessionDocument, {}).toPromise();

	if (!result.data) {
		return null;
	}

	return {
		...result.data.getSessionUser,
	};
}

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.urql = createClient({
		fetch: async (...args) => {
			const response = await event.fetch(...args);

			const headerCookies = response.headers.get('set-cookie');

			if (!headerCookies) {
				return response;
			}

			const cookies: string[] = Array.isArray(headerCookies) ? headerCookies : [headerCookies];

			cookies.forEach((cookie) => {
				const { name, value, ...opts } = parseString(cookie);

				event.cookies.set(name, value, {
					...opts,
					// @ts-expect-error set-cookie-parser has string instead of strict type
					sameSite: opts.sameSite,
				});
			});

			return response;
		},
		requestToken: event.cookies.get(AUTH_COOKIE_NAME),
		ws,
	});

	event.locals.sessionUser = await getAuthUser(event.locals.urql);

	return resolve(event);
};

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	if (request.url.startsWith(PUBLIC_API_ADDR)) {
		const cookieHeader = event.request.headers.get('cookie');

		if (cookieHeader) {
			request.headers.set('cookie', cookieHeader);
		}
	}

	return fetch(request);
};
