import type { Writable } from 'svelte/store';
import { useLocalCookie } from './local-cookie';
import { Toggleable, useToggleable } from './toggleable';

export const themes = ['dark', 'light'] as const;
export type Theme = typeof themes[number];

export const isTheme = (theme: string | null) => {
	if (!theme) {
		return false;
	}
	return (themes as readonly string[]).includes(theme);
};

const theme = useLocalCookie('theme');

const toggleableTheme = useToggleable(theme, () => {
	return theme.update((currentTheme) => {
		return currentTheme == 'light' ? 'dark' : 'light';
	});
});

export type ThemeStore = Writable<Theme | null> & Toggleable;

export const themeStore: ThemeStore = toggleableTheme;
