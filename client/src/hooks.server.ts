import { PUBLIC_API_ADDR } from '$env/static/public';
import { createClient } from '$lib/urql';
import type { Handle, HandleFetch, ResolveOptions } from '@sveltejs/kit';
import type { Client } from '@urql/svelte';
import { parseString } from 'set-cookie-parser';
import ws from 'ws';
import { GetUserFromSessionDocument } from './graphql/@generated';
import { themeCookieName, themes, type Theme } from './lib/stores';

export async function getAuthUser(urql: Client) {
	const result = await urql.query(GetUserFromSessionDocument, {}).toPromise();

	if (!result.data) {
		return null;
	}

	return {
		...result.data.getSessionUser,
	};
}

export type ClientUser = Awaited<ReturnType<typeof getAuthUser>>;

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.urql = createClient({
		fetch: event.fetch,
		ws,
	});

	event.locals.sessionUser = await getAuthUser(event.locals.urql);

	const themeCookie = event.cookies.get(themeCookieName) as Theme | 'null' | undefined;

	if (themeCookie) {
		event.locals.theme = themeCookie != 'null' && themes.includes(themeCookie) ? themeCookie : undefined;
	}

	const opts: ResolveOptions | undefined = ['dark', undefined].includes(event.locals.theme)
		? {
				transformPageChunk({ html }) {
					return html.replace('<html lang="en">', '<html lang="en" class="dark">');
				},
		  }
		: undefined;

	return resolve(event, opts);
};

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	if (request.url.startsWith(PUBLIC_API_ADDR)) {
		const cookieHeader = event.request.headers.get('cookie');

		if (cookieHeader) {
			request.headers.set('cookie', cookieHeader);
		}
	}

	const response = await fetch(request);

	const headerCookies = response.headers.get('set-cookie');

	if (!headerCookies) {
		return response;
	}

	const cookies: string[] = Array.isArray(headerCookies) ? headerCookies : [headerCookies];

	cookies.forEach((cookie) => {
		const { name, value, ...opts } = parseString(cookie);

		event.cookies.set(name, value, {
			...opts,
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore set-cookie-parser has string instead of strict type
			sameSite: opts.sameSite,
		});
	});

	return response;
};
