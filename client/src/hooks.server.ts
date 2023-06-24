import { PUBLIC_API_ADDR } from '$env/static/public';
import { createClient } from '$lib/urql';
import { getUser } from '$lib/utils/hooks-helper.server';
import type { Handle, HandleFetch } from '@sveltejs/kit';
import ws from 'ws';
import { AUTH_COOKIE_NAME } from './lib/utils/auth';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.client = createClient({
		fetch: event.fetch,
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
