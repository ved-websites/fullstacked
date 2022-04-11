import { browser } from '$app/env';
import { session } from '$app/stores';
import { derived, type Writable } from 'svelte/store';

export function updateCookie(key: string, value?: string | null) {
	if (!browser) {
		return;
	}

	if (value) {
		document.cookie = `${key}=${value}; expires=31 Dec 9999 12:00:00 UTC; SameSite=Lax; path=/`;
	} else {
		document.cookie = `${key}=; expires=01 Jan 1970 00:00:01 UTC; path=/`;
	}
}

export function useCookie<K extends keyof App.Session>(key: K, valueWhenEmpty?: () => App.Session[K]) {
	function cookieUpdater(valueFetcher: (currentValue: App.Session[K]) => App.Session[K]) {
		if (!browser) {
			return;
		}

		session.update((sessionData) => {
			const sessionValue = sessionData[key];
			const currentValue = sessionValue ?? valueWhenEmpty?.() ?? null;

			const value = valueFetcher(currentValue);

			updateCookie(key, value);

			return {
				...sessionData,
				[key]: value,
			};
		});
	}

	return {
		...derived<Writable<App.Session>, App.Session[K]>(session, (sessionData, set) => set(sessionData[key])),
		update: (updater) => cookieUpdater((currentValue) => updater(currentValue)),
		set: (newValue) => cookieUpdater(() => newValue),
	} as Writable<App.Session[K]>;
}
