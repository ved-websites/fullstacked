import { fallbackLocale, locales, type I18nInstanceType } from '$i18n-config';
import { createStoreContext } from '$lib/stores/utils/context';
import { pick } from 'accept-language-parser';

export function getBrowserLang(request: Request) {
	const langHeader = request.headers.get('Accept-Language');

	if (!langHeader) {
		return fallbackLocale;
	}

	const lang = pick(locales, langHeader, { loose: true });

	return lang ?? fallbackLocale;
}

export const { getStore: getI18n, setStore: setI18n } = createStoreContext<I18nInstanceType>({
	key: 'i18n',
});

export function k<K extends string = string>(key: K) {
	return key;
}
