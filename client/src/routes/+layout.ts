import { loadI18n } from '$i18n-config';
import type { LayoutLoad } from './$types';

export const load = (async ({ url, data }) => {
	const { sessionUser, browserLang, layoutAlert, theme, userHasJs } = data;

	const locale = sessionUser?.lang ?? browserLang;

	const i18nInstance = await loadI18n(locale, url.pathname);

	return {
		sessionUser,
		theme,
		layoutAlert,
		userHasJs,
		i18n: i18nInstance,
	};
}) satisfies LayoutLoad;
