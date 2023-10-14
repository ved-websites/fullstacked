import { loadI18n } from '$i18n';
import type { LayoutLoad } from './$types';

export const load = (async ({ url, data }) => {
	const { sessionUser, browserLang } = data;

	const locale = sessionUser?.lang ?? browserLang;

	const i18nInstance = await loadI18n(locale, url.pathname);

	return {
		...data,
		i18n: i18nInstance,
	};
}) satisfies LayoutLoad;
