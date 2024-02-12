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

const i18nStoreContext = createStoreContext<I18nInstanceType>({
	key: 'i18n',
});

/**
 * ```ts
 * let i18n = getI18n();
 * $: ({ t } = $i18n);
 * ```
 *
 * Gets the i18n store from the current context.
 */
export const getI18n = i18nStoreContext.getStore;
export const setI18n = i18nStoreContext.setStore;
