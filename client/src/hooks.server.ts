import { PUBLIC_API_ADDR } from '$env/static/public';
import { createClient } from '$lib/urql';
import { getUser } from '$lib/utils/hooks-helper.server';
import type { Handle, HandleFetch } from '@sveltejs/kit';
import ws from 'ws';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.getClient = (clientEvent, options) => {
		return createClient({
			fetch: clientEvent.fetch,
			requestToken: clientEvent.cookies.get('session'),
			ws,
			...options,
		});
	};

	event.locals.getUser = async (userEvent) => {
		const functionEvent = userEvent ?? event;

		return getUser(functionEvent.locals.getClient(functionEvent));
	};

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
