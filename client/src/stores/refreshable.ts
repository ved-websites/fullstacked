import type { Writable } from 'svelte/store';

export interface Refreshable {
	refresh(): void;
}

export function useRefreshable<W extends Writable<unknown>>(object: W, onRefresh: (object: W) => void): typeof object & Refreshable {
	return {
		refresh: () => onRefresh(object),
		...object,
	};
}
