import { page } from '$app/state';
import type { I18nInstanceType } from '$i18n-config';

export function getTextFromRouteId(t: I18nInstanceType['t'], keyMapper: (path: string) => string) {
	const routeId = page.route.id?.replaceAll('/', '.').substring(1);

	let path = routeId;

	if (path === undefined) {
		path = '';
	} else if (path.length === 0) {
		path = 'home';
	}

	const textKey = keyMapper(path);

	if (textKey.includes('(')) {
		const noGroupTextKey = textKey.replaceAll(/\(.*?\)\./g, '');

		const noGroupText: string = t.get(noGroupTextKey);

		if (noGroupTextKey !== noGroupText) {
			return noGroupText;
		}
	}

	const text: string = t.get(textKey);

	if (text !== textKey) {
		return text;
	}

	return undefined;
}
