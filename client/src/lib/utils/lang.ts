import type { ServerLoadEvent } from '@sveltejs/kit';

const defaultLang = 'en';

export function getUserLang({ request, locals: { sessionUser } }: ServerLoadEvent) {
	if (sessionUser?.lang) {
		return sessionUser?.lang;
	}

	const langHeader = request.headers.get('Accept-Language');

	if (!langHeader) {
		return defaultLang;
	}
	const mainLangs = langHeader.split(';')[0];

	if (!mainLangs) {
		return defaultLang;
	}

	const mainLang = mainLangs.split(',')[0];

	return mainLang ?? defaultLang;
}
