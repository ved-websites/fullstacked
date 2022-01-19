import { localStorageStore } from './local-storage';
import { makeToggleable, Toggleable } from './toggleable';

const themeLocalStore = localStorageStore<'light' | 'dark'>('app-theme', 'dark');

type ThemeStoreType = typeof themeLocalStore;

interface ThemeStore extends ThemeStoreType, Toggleable {
	/**
	 * Toggles the theme between 'light' and 'dark'.
	 */
	toggle(): void;
}

export const themeStore: ThemeStore = makeToggleable(themeLocalStore, () => {
	return themeLocalStore.update((current) => (current == 'light' ? 'dark' : 'light'));
});
