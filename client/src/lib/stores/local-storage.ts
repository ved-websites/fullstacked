import { browser } from '$app/environment';
import { writable, type Updater, type Writable } from 'svelte/store';

export function setLocalItem(key: string, value: string | null) {
	try {
		if (value) {
			localStorage.setItem(key, value);
		} else {
			localStorage.removeItem(key);
		}
	} catch (error) {
		console.error(`The \`${key}\` store's new value \`${value}\` could not be persisted to localStorage because of ${error}.`);
	}
}

export function getLocalItem(key: string) {
	try {
		return localStorage.getItem(key);
	} catch (error) {
		console.error(`The \`${key}\` store's value could not be restored from localStorage because of ${error}.`);
	}

	return null;
}

export type LocalStorageParser = {
	serialize: <T = unknown>(value: T) => string | null;
	deserialize: <T = unknown>(value: string | null) => T | null;
};

export type DefaultLocalStorageParsers = 'JSON';

export const LocalStorageParsers: Record<DefaultLocalStorageParsers, LocalStorageParser> = {
	JSON: {
		serialize: (value) => {
			if (value == null) {
				return null;
			}

			if (typeof value == 'string') {
				return value;
			}

			return JSON.stringify(value);
		},
		deserialize: (value) => {
			if (value == null) {
				return null;
			}
			try {
				return JSON.parse(value);
			} catch (error) {
				return value;
			}
		},
	},
};

export type LocalStorageStoreOptions<T> = {
	valueWhenEmpty: () => T;
	parser: LocalStorageParser;
};

// Adapted from https://higsch.me/2019/06/22/2019-06-21-svelte-local-storage/
// Transferred to typescript from https://svelte.dev/repl/7b4d6b448f8c4ed2b3d5a3c31260be2a?version=3.32.2
export function useLocalStorage<T = string>(key: string, options?: Partial<LocalStorageStoreOptions<T>>) {
	const { valueWhenEmpty, parser = LocalStorageParsers.JSON } = options ?? {};

	const {
		set: setStore,
		update: updateStore,
		...readableStore
	} = writable<T | null>(null, () => {
		if (!browser) return;

		getAndSetFromLocalStorage();

		const updateFromStorageEvents = (event: StorageEvent) => {
			if (event.key === key) getAndSetFromLocalStorage();
		};

		window.addEventListener('storage', updateFromStorageEvents);
		return () => window.removeEventListener('storage', updateFromStorageEvents);
	});

	// Set both localStorage and this Svelte store
	const set = (value: T | null) => {
		const parsedValue = parser.serialize(value);

		setLocalItem(key, parsedValue);

		setStore(value);
	};

	const update = (updater: Updater<T | null>) => {
		updateStore((current) => {
			const newValue = updater(current);

			const parsedValue = parser.serialize(newValue);

			setLocalItem(key, parsedValue);

			return newValue;
		});
	};

	// Synchronize the Svelte store with localStorage
	const getAndSetFromLocalStorage = () => {
		const localValue = getLocalItem(key);

		const parsedValue = parser.deserialize<T>(localValue);

		if (parsedValue === null) {
			set(valueWhenEmpty?.() ?? null);
		} else {
			try {
				setStore(parsedValue);
			} catch {
				set(valueWhenEmpty?.() ?? null);
			}
		}
	};

	return { ...readableStore, update, set } as Writable<T | null>;
}
