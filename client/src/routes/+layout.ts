import { loadTranslations } from '$i18n';
import type { LayoutLoad } from './$types';

export const load = (async ({ url: { pathname }, data }) => {
	await loadTranslations(data.lang, pathname);

	return data;
}) satisfies LayoutLoad;
