import { browser } from '$app/env';
import { session } from '$app/stores';
import { derived, type Writable } from 'svelte/store';

export function makeCookieable<K extends keyof App.Session>(key: K, valueWhenEmpty?: () => App.Session[K]) {
	function cookieUpdater(valueFetcher: (currentValue: App.Session[K] | undefined) => App.Session[K] | undefined) {
		session.update((sessionData) => {
			const currentValue = sessionData[key] ?? valueWhenEmpty?.();

			const value = valueFetcher(currentValue);

			if (browser) {
				if (value) {
					document.cookie = `${key}=${value}; expires=31 Dec 9999 12:00:00 UTC; path=/`;
				} else {
					document.cookie = `${key}=; expires=01 Jan 1970 00:00:01 UTC; path=/`;
				}
			}

			return {
				...sessionData,
				[key]: value,
			};
		});
	}

	return {
		...derived<Writable<App.Session>, App.Session[K]>(session, (sessionData, set) => set(sessionData[key])),
		update: (updater) => cookieUpdater((currentValue) => currentValue && updater(currentValue)),
		set: (newValue) => cookieUpdater(() => newValue),
	} as Writable<App.Session[K]>;
}
