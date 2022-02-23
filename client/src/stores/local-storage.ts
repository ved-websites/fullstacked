import { browser } from '$app/env';
import { Updater, Writable, writable } from 'svelte/store';

// Replace with process.browser in Sapper
// Or browser (`import { browser } from "$app/env";`) in SvelteKit
// const browser = true;

type WritableLocalStorage<T> = Writable<T>;

// Adapted from https://higsch.me/2019/06/22/2019-06-21-svelte-local-storage/
// Transferred to typescript from https://svelte.dev/repl/7b4d6b448f8c4ed2b3d5a3c31260be2a?version=3.32.2
export function localStorageStore<T>(key: string, initial: T): WritableLocalStorage<T> {
	const {
		set: setStore,
		update: updateStore,
		...readableStore
	} = writable(initial, () => {
		if (!browser) return;

		getAndSetFromLocalStorage();

		const updateFromStorageEvents = (event: StorageEvent) => {
			if (event.key === key) getAndSetFromLocalStorage();
		};

		window.addEventListener('storage', updateFromStorageEvents);
		return () => window.removeEventListener('storage', updateFromStorageEvents);
	});

	// Set both localStorage and this Svelte store
	const set = (value: T) => {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.error(`the \`${key}\` store's new value \`${value}\` could not be persisted to localStorage because of ${error}`);
		}

		setStore(value);
	};

	const update = (updater: Updater<T>) => {
		updateStore((current) => {
			const newValue = updater(current);

			try {
				localStorage.setItem(key, JSON.stringify(newValue));
			} catch (error) {
				console.error(`the \`${key}\` store's new value \`${current}\` could not be persisted to localStorage because of ${error}`);
			}

			return newValue;
		});
	};

	// Synchronize the Svelte store with localStorage
	const getAndSetFromLocalStorage = () => {
		let localValue = null;

		try {
			localValue = localStorage.getItem(key);
		} catch (error) {
			console.error(`the \`${key}\` store's value could not be restored from localStorage because of ${error}`);
		}

		if (localValue === null) set(initial);
		else {
			try {
				setStore(JSON.parse(localValue));
			} catch {
				set(initial);
			}
		}
	};

	return { ...readableStore, update, set };
}
