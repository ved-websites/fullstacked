import { PUBLIC_API_ADDR } from '$env/static/public';
import { setSession } from '$houdini';
import type { Handle, HandleFetch } from '@sveltejs/kit';
import { parseString } from 'set-cookie-parser';
import { AUTH_COOKIE_NAME, getAuthUser } from './auth/auth-handler';
import { createHoudiniHelpers } from './lib/houdini/helper';
import { themeCookieName, themes, type Theme } from './lib/stores';
import { HASJS_COOKIE_NAME } from './lib/utils/js-handling';
import { getBrowserLang } from './lib/utils/lang';
import { verifyUserAccess } from './navigation/permissions';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.gql = createHoudiniHelpers(event);

	const token = event.cookies.get(AUTH_COOKIE_NAME);

	setSession(event, { token });

	if (token) {
		event.locals.sessionUser = await getAuthUser(event.locals.gql.query);
	}

	verifyUserAccess(event);

	event.locals.browserLang = getBrowserLang(event.request);

	event.locals.userHasJs = !!event.cookies.get(HASJS_COOKIE_NAME);

	const themeCookie = event.cookies.get(themeCookieName) as Theme | 'null' | undefined;

	if (themeCookie) {
		event.locals.theme = themeCookie != 'null' && themes.includes(themeCookie) ? themeCookie : undefined;
	}

	const opts = ((): Parameters<typeof resolve>[1] => {
		if (!['dark', undefined].includes(event.locals.theme)) {
			return undefined;
		}

		return {
			transformPageChunk({ html }) {
				return html.replace('<html lang="en">', '<html lang="en" class="dark">');
			},
		};
	})();

	return resolve(event, opts);
};

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	if (request.url.startsWith(PUBLIC_API_ADDR)) {
		const headers = event.request.headers.entries();

		const passedHeaders: string[] = ['cookies', 'accept-language'];

		for (const [name, value] of headers) {
			if (!passedHeaders.includes(name)) {
				continue;
			}
			request.headers.set(name, value);
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
