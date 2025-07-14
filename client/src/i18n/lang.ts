import { fallbackLocale, locales } from '$i18n-config';
import { pick } from 'accept-language-parser';

export function getBrowserLang(request: Request) {
	const langHeader = request.headers.get('Accept-Language');

	if (!langHeader) {
		return fallbackLocale;
	}

	const lang = pick(locales, langHeader, { loose: true });

	return lang ?? fallbackLocale;
}
