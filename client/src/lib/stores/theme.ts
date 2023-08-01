import type { Writable } from 'svelte/store';
import { useCookie } from './utils/storage/cookie';
import { useToggleable, type Toggleable } from './utils/toggleable';

export const themeCookieName = 'color-theme';

export const themes = ['dark', 'light'] as const;
export type Theme = (typeof themes)[number];

export const isTheme = (theme: string | null) => {
	if (!theme) {
		return false;
	}
	return (themes as readonly string[]).includes(theme);
};

const theme = useCookie<Theme>(themeCookieName, {
	cookieUpdateOpts: {
		// eslint-disable-next-line @typescript-eslint/no-magic-numbers
		expiration: new Date('01 Jan 9999'), // Longest expiration time.
	},
});

const toggleableTheme = useToggleable(theme, () => {
	return theme.update((currentTheme) => {
		return currentTheme == 'light' ? 'dark' : 'light';
	});
});

export type ThemeStore = Writable<Theme | null> & Toggleable;

export const themeStore: ThemeStore = toggleableTheme;
