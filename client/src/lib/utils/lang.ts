import { fallbackLocale, locales } from '$i18n';
import type { ServerLoadEvent } from '@sveltejs/kit';
import { pick } from 'accept-language-parser';

export function getUserLang({ request, locals: { sessionUser } }: ServerLoadEvent) {
	if (sessionUser?.lang) {
		return sessionUser.lang;
	}

	const langHeader = request.headers.get('Accept-Language');

	if (!langHeader) {
		return fallbackLocale;
	}

	const lang = pick(locales.get(), langHeader, { loose: true });

	return lang ?? fallbackLocale;
}
