import { makeCookieable } from './cookie';
import { makeToggleable } from './toggleable';

export const themes = ['dark', 'light'] as const;
export type Theme = typeof themes[number] | null;

export const isTheme = (theme: string | null) => {
	if (!theme) {
		return false;
	}
	return (themes as readonly string[]).includes(theme);
};

const theme = makeCookieable('theme', () => {
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
});

export const themeStore = makeToggleable(theme, () => {
	return theme.update((currentTheme) => {
		return currentTheme == 'light' ? 'dark' : 'light';
	});
});
