import { PUBLIC_API_ADDR } from '$env/static/public';
import { GetUserFromSessionStore, setSession } from '$houdini';
import type { Handle, HandleFetch } from '@sveltejs/kit';
import { parseString } from 'set-cookie-parser';
import type { AppLocals } from './app';
import { createHoudiniHelpers } from './lib/houdini/helper';
import { themeCookieName, themes, type Theme } from './lib/stores';
import { verifyUserAccess } from './navigation/permissions';

export const AUTH_COOKIE_NAME = 'auth_session';

export async function getAuthUser(query: AppLocals['gql']['query']) {
	const result = await query(GetUserFromSessionStore);

	if (result.type === 'failure') {
		return null;
	}

	const { getSessionUser: sessionUser } = result.data;

	return sessionUser;
}

export type SessionUser = Awaited<ReturnType<typeof getAuthUser>>;

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.gql = createHoudiniHelpers(event);

	const token = event.cookies.get(AUTH_COOKIE_NAME);

	setSession(event, { token });

	if (token) {
		event.locals.sessionUser = await getAuthUser(event.locals.gql.query);
	}

	verifyUserAccess(event);

	const themeCookie = event.cookies.get(themeCookieName) as Theme | 'null' | undefined;

	if (themeCookie) {
		event.locals.theme = themeCookie != 'null' && themes.includes(themeCookie) ? themeCookie : undefined;
	}

	const opts: Parameters<typeof resolve>[1] = ['dark', undefined].includes(event.locals.theme)
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
