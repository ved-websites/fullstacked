import { isTheme, Theme } from '$/stores';

export const getCookieValue = (cookie: string | null, name: string): string | null => {
	return cookie?.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`)?.pop() || null;
};

export function getThemeFromCookie(cookie: string | null) {
	const themeCookie = getCookieValue(cookie, 'theme');

	return isTheme(themeCookie) ? themeCookie as Theme : null;
}
