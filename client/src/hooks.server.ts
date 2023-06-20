import type { Handle } from '@sveltejs/kit';
import ws from 'ws';
import { createClient } from './lib/urql';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.client = createClient({
		fetch: event.fetch,
		token: event.cookies.get('authorization'),
		ws,
	});

	return resolve(event);
};
