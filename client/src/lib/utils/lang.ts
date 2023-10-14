import { fallbackLocale, locales, type I18nInstanceType } from '$i18n';
import { pick } from 'accept-language-parser';
import { getContext } from 'svelte';

export function getBrowserLang(request: Request) {
	const langHeader = request.headers.get('Accept-Language');

	if (!langHeader) {
		return fallbackLocale;
	}

	const lang = pick(locales, langHeader, { loose: true });

	return lang ?? fallbackLocale;
}

export const i18nContextKey = 'i18n';

export function getI18n() {
	const i18nContext = getContext(i18nContextKey) as I18nInstanceType;

	return {
		locales,
		...i18nContext,
	};
}

export function k<K extends string = string>(key: K) {
	return key;
}
