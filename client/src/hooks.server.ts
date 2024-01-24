import { PUBLIC_API_ADDR } from '$env/static/public';
import { getBrowserLang } from '$i18n';
import { createTsRestClient } from '$lib/ts-rest/client';
import type { Handle, HandleFetch } from '@sveltejs/kit';
import { parseString } from 'set-cookie-parser';
import { AUTH_COOKIE_NAME, getAuthUser } from './auth/auth-handler';
import { themeCookieName, themes, type Theme } from './lib/stores';
import { HASJS_COOKIE_NAME } from './lib/utils/js-handling';
import { verifyUserAccess } from './navigation/permissions';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.step = 'hook';

	event.locals.tsrest = createTsRestClient(event);

	const token = event.cookies.get(AUTH_COOKIE_NAME);

	if (token) {
		event.locals.sessionUser = await getAuthUser(event.locals.tsrest);
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

	event.locals.step = 'action';

	const response = await resolve(event, opts);

	event.locals.step = 'resolved';

	return response;
};

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	if (request.url.startsWith(PUBLIC_API_ADDR)) {
		const passedHeaders: string[] = ['cookie', 'accept-language'];

		passedHeaders.forEach((header) => {
			const headerValue = event.request.headers.get(header);

			if (headerValue) {
				request.headers.set(header, headerValue);
			}
		});
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
			// @ts-expect-error set-cookie-parser has string instead of strict type
			sameSite: opts.sameSite,
		});
	});

	return response;
};
