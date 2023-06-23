import { browser } from '$app/environment';
// import { session } from '$app/stores';
// import { derived, type Writable } from 'svelte/store';

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

export function updateCookie(key: string, value?: string | null) {
	if (!browser) {
		return;
	}

	if (value) {
		document.cookie = `${key}=${value}; SameSite=Lax; path=/`;
	} else {
		document.cookie = `${key}=; expires=01 Jan 1970 00:00:01 UTC; path=/`;
	}
}
