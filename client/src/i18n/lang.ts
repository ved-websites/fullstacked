import { fallbackLocale, locales, type I18nInstanceType } from '$i18n-config';
import { pick } from 'accept-language-parser';
import { getContext, setContext } from 'svelte';
import { get, writable, type Writable } from 'svelte/store';

export function getBrowserLang(request: Request) {
	const langHeader = request.headers.get('Accept-Language');

	if (!langHeader) {
		return fallbackLocale;
	}

	const lang = pick(locales, langHeader, { loose: true });

	return lang ?? fallbackLocale;
}

export const i18nContextKey = 'i18n';

export function setI18n(i18n: I18nInstanceType) {
	const contextI18n = getI18n() as ReturnType<typeof getI18n> | undefined;

	if (!contextI18n) {
		const i18nContext = writable<I18nInstanceType>(i18n);

		setContext(i18nContextKey, i18nContext);

		return;
	}

	if (get(contextI18n) === i18n) {
		return;
	}

	contextI18n.set(i18n);
}

export function getI18n() {
	return getContext(i18nContextKey) as Writable<I18nInstanceType>;
}

export function k<K extends string = string>(key: K) {
	return key;
}
