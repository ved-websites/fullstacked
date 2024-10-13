import { navigating } from '$app/stores';
import type { SessionUser } from '$auth/auth-handler';
import { reconstructUrl } from '$lib/utils/urls';
import { readable, writable } from 'svelte/store';
import { createStoreContext } from './utils/context';
import { useToggleable } from './utils/toggleable';

export const isDrawerHidden = useToggleable(writable(true), (drawerOpenStore) => drawerOpenStore.update((isOpen) => !isOpen));

export const { getStore: getSessionUser, setStore: setSessionUser } = createStoreContext<SessionUser>();

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
