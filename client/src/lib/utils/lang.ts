import { fallbackLocale, locales } from '$i18n';
import { pick } from 'accept-language-parser';

export function getBrowserLang(request: Request) {
	const langHeader = request.headers.get('Accept-Language');

	if (!langHeader) {
		return fallbackLocale;
	}

	const lang = pick(locales.get(), langHeader, { loose: true });

	return lang ?? fallbackLocale;
}
