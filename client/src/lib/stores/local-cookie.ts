import { onDestroy } from 'svelte';
import { derived } from 'svelte/store';
import { getCookie, updateCookie } from '../utils/cookie';
import { useLocalStorage } from './local-storage';

export function useLocalCookie(...args: Parameters<typeof useLocalStorage<string>>) {
	const localStorageStore = useLocalStorage(...args);

	const unsubscribe = localStorageStore.subscribe((value) => {
		updateCookie(args[0], value);
	});

	onDestroy(() => {
		unsubscribe();
	});

	return derived<typeof localStorageStore, string | null>(localStorageStore, ($localStorageStore, set) => {
		const properValue = $localStorageStore ?? getCookie(args[0]) ?? null;

		set(properValue);
	});
}
