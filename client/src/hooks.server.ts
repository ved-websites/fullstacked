import { PUBLIC_API_ADDR } from '$env/static/public';
import { createClient } from '$lib/urql';
import { getUser } from '$lib/utils/hooks-helper.server';
import type { Handle, HandleFetch } from '@sveltejs/kit';
import { parseString } from 'set-cookie-parser';
import ws from 'ws';
import { AUTH_COOKIE_NAME } from './lib/utils/auth';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.client = createClient({
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

	event.locals.user = getUser(event.locals.client);

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
