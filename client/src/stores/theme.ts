// import { localStorageStore } from './local-storage';
import { browser } from '$app/env';
import { session } from '$app/stores';
import type { Writable } from 'svelte/store';
import { derived } from 'svelte/store';
import { makeToggleable } from './toggleable';

export const themes = ['light', 'dark'] as const;
export type Theme = typeof themes[number] | null;

export const isTheme = (theme: string | null) => {
	if (!theme) {
		return false;
	}
	return (themes as readonly string[]).includes(theme);
};

// const themeLocalStore = localStorageStore<Theme>('app-theme', null);

// type ThemeStoreType = typeof themeLocalStore;

// interface ThemeStore extends Toggleable {
// 	/**
// 	 * Toggles the theme between 'light' and 'dark'.
// 	 */
// 	toggle(): void;
// }

const theme = derived<Writable<App.Session>, Theme>(session, (sessionData, set) => {
	set(sessionData.theme);
});

export const themeStore = makeToggleable(theme, () => {
	return session.update((sessionData) => {
		const currentTheme: Theme = sessionData.theme ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

		const newTheme = currentTheme == 'light' ? 'dark' : 'light';

		if (browser) {
			document.cookie = `theme=${newTheme}; expires=31 Dec 9999 12:00:00 UTC; path=/`;
		}

		return {
			...sessionData,
			theme: newTheme,
		};
	});
});
