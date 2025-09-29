import { navigating } from '$app/stores';
import { reconstructUrl } from '$lib/utils/urls';
import { readable, writable } from 'svelte/store';
import { useToggleable } from './utils/toggleable';

export const isDrawerOpen = useToggleable(writable(false), (drawerOpenStore) => drawerOpenStore.update((isOpen) => !isOpen));

export const previousPage = readable<string | undefined>(undefined, (set) => {
	const unsubscribe = navigating.subscribe(($navigating) => {
		// Check if `$navigating` has a value
		// because it's set to `null` after navigation is done
		if ($navigating) {
			const fromUrl = $navigating.from?.url;

			if (!fromUrl) {
				set(undefined);
			} else {
				set(reconstructUrl(fromUrl));
			}
		}
	});

	return () => unsubscribe();
});

export * from './theme';
export * from './utils/matchMedia';
export * from './utils/storage/local-storage';
