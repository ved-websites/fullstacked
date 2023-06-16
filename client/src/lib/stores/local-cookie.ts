// import { derived, type Writable } from 'svelte/store';
// import { useCookie } from './cookie';
// import { LocalStorageParsers, useLocalStorage, type LocalStorageStoreOptions } from './local-storage';

// export function useLocalCookie<K extends keyof App.Session>(key: K, options?: Partial<LocalStorageStoreOptions<App.Session[K]>>) {
// 	const { valueWhenEmpty, parser = LocalStorageParsers.JSON } = options ?? {};

// 	const scopedCookie = useCookie(key, valueWhenEmpty);
// 	const scopedLocalStorage = useLocalStorage(key, { valueWhenEmpty, parser });

// 	const derivedStore = derived([scopedCookie, scopedLocalStorage], ([$cookieValue, $localStorageValue], set) => {
// 		const properValue = $localStorageValue ?? $cookieValue;

// 		set(properValue);
// 	});

// 	return {
// 		...derivedStore,
// 		update: (updater) => {
// 			scopedLocalStorage.update((value) => value && updater(value));
// 			scopedCookie.update(updater);
// 		},
// 		set: (newValue) => {
// 			scopedLocalStorage.set(newValue);
// 			scopedCookie.set(newValue);
// 		},
// 	} as Writable<App.Session[K]>;
// }
