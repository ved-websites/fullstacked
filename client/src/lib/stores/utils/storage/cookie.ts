import { browser } from '$app/environment';
import { writable, type Updater, type Writable } from 'svelte/store';

export function getCookie(name: string) {
	if (!browser) {
		return;
	}

	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);

	// eslint-disable-next-line @typescript-eslint/no-magic-numbers
	if (parts.length === 2) {
		return parts.pop()!.split(';').shift();
	}
}

export type CookieUpdateOptions = {
	expiration: Date;
};

export function updateCookie(key: string, value?: string | null, options?: Partial<CookieUpdateOptions>) {
	if (!browser) {
		return;
	}

	if (value) {
		const expiration = options?.expiration ? options.expiration.toUTCString() : false;

		document.cookie = `${key}=${value}; SameSite=Lax; path=/${expiration ? `; expires=${expiration}` : ''}`;
	} else {
		document.cookie = `${key}=; expires=01 Jan 1970 00:00:01 UTC; path=/`;
	}
}

export type CookieOptions<T> = {
	valueWhenEmpty: () => T;
	cookieUpdateOpts: Partial<CookieUpdateOptions>;
};

export function useCookie<T extends string = string>(key: string, options?: Partial<CookieOptions<T>>) {
	const { valueWhenEmpty, cookieUpdateOpts } = options ?? {};

	const {
		set: setStore,
		update: updateStore,
		...readableStore
	} = writable<T | null>(null, () => {
		if (!browser) return;

		const value = getCookie(key);

		if (value === null) {
			setStore(valueWhenEmpty?.() ?? null);
		} else {
			setStore((value as T) ?? null);
		}
	});

	// Set both cookie and this Svelte store
	const set = (value: T | null) => {
		updateCookie(key, value, cookieUpdateOpts);

		if (value === null) {
			setStore(valueWhenEmpty?.() ?? null);
		} else {
			setStore(value);
		}
	};

	const update = (updater: Updater<T | null>) => {
		updateStore((current) => {
			const newValue = updater(current);

			if (newValue === null) {
				setStore(valueWhenEmpty?.() ?? null);
			} else {
				setStore(newValue);
			}

			return newValue;
		});
	};

	return { ...readableStore, update, set } as Writable<T | null>;
}
