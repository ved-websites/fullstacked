import { page } from '$app/stores';
import type { I18nInstanceType } from '$i18n-config';
import { derived } from 'svelte/store';

export function getTextFromRouteId(t: I18nInstanceType['t'], keyMapper: (path: string) => string) {
	const routeIdTextStore = derived(page, ($page) => {
		let path = $page.route.id?.replaceAll('/', '.').substring(1);

		if (path === undefined) {
			path = '';
		} else if (path.length === 0) {
			path = 'home';
		}

		const textKey = `${path}.title`;
		const text: string = t.get(textKey);

		if (text !== textKey) {
			return text;
		}

		if (textKey.includes('(')) {
			const noGroupTextKey = textKey.replaceAll(/\(.*?\)\./g, '');

			const noGroupText: string = t.get(noGroupTextKey);

			if (noGroupTextKey !== noGroupText) {
				return noGroupText;
			}
		}

		return undefined;
	});

	return routeIdTextStore;
}
