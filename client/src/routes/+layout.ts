import { loadTranslations } from '$i18n';
import type { LayoutLoad } from './$types';

export const load = (async ({ url: { pathname }, data }) => {
	const { sessionUser, browserLang } = data;

	await loadTranslations(sessionUser?.lang ?? browserLang, pathname);

	return data;
}) satisfies LayoutLoad;
