import { derived, Writable } from 'svelte/store';
import { useCookie } from './cookie';
import { LocalStorageParsers, LocalStorageStoreOptions, useLocalStorage } from './local-storage';

export function useLocalCookie<K extends keyof App.Session>(key: K, options?: Partial<LocalStorageStoreOptions<App.Session[K]>>) {
	const { valueWhenEmpty, parser = LocalStorageParsers.JSON } = options ?? {};

	const $cookie = useCookie(key, valueWhenEmpty);
	const $scopedLocalStorage = useLocalStorage(key, { valueWhenEmpty, parser });

	const derivedStore = derived([$cookie, $scopedLocalStorage], ([$cookieValue, $localStorageValue], set) => {
		const properValue = $cookieValue ?? $localStorageValue;

		set(properValue);
	});

	return {
		...derivedStore,
		update: (updater) => {
			$scopedLocalStorage.update((value) => value && updater(value));
			$cookie.update(updater);
		},
		set: (newValue) => {
			$scopedLocalStorage.set(newValue);
			$cookie.set(newValue);
		},
	} as Writable<App.Session[K]>;
}
