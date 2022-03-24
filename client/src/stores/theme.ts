import type { Writable } from 'svelte/store';
import { makeCookieable } from './cookie';
import { makeToggleable, Toggleable } from './toggleable';

export const themes = ['dark', 'light'] as const;
export type Theme = typeof themes[number];

export const isTheme = (theme: string | null) => {
	if (!theme) {
		return false;
	}
	return (themes as readonly string[]).includes(theme);
};

const theme = makeCookieable('theme', () => {
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
});

const toggleableTheme = makeToggleable(theme, () => {
	return theme.update((currentTheme) => {
		return currentTheme == 'light' ? 'dark' : 'light';
	});
});

export type ThemeStore = Writable<Theme | null> & Toggleable;

export const themeStore: ThemeStore = toggleableTheme;
