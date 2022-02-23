import { getThemeFromCookie } from '$/utils/cookies';
import type { GetSession, Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const cookie = event.request.headers.get('cookie');

	event.locals.theme = getThemeFromCookie(cookie);
	
	return resolve(event);
};

export const getSession: GetSession = ({ locals }) => {
	const theme = locals.theme;

	return { theme };
};
