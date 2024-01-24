import { browser } from '$app/environment';
import { page } from '$app/stores';
import { getFlash } from 'sveltekit-flash-message/client';

export function flashStore() {
	if (!browser) {
		return;
	}

	return getFlash(page);
}
