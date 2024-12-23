import { page } from '$app/stores';
import type { PageMessages } from '$lib/types';
import type { RequestEvent } from '@sveltejs/kit';
import type { Writable } from 'svelte/store';
import { getFlash } from 'sveltekit-flash-message/client';

export function flashStore<T extends Record<string, unknown> = Record<string, unknown>>() {
	try {
		return getFlash(page) as Writable<PageMessages & T>;
	} catch (_error) {
		return undefined;
	}
}

export function parseCookies(cookieHeader: string | undefined) {
	const list: Record<string, string> = {};

	if (!cookieHeader) return list;

	cookieHeader.split(`;`).forEach(function (cookie) {
		const [name, ...rest] = cookie.split(`=`);

		const trimmedName = name?.trim();

		if (!trimmedName) return;
		const value = rest.join(`=`).trim();

		if (!value) return;
		list[trimmedName] = decodeURIComponent(value);
	});

	return list;
}

export function extractFlashMessageFromEvent(event: RequestEvent) {
	const cookieHeader = event.request.headers.get('cookie');

	if (!cookieHeader) {
		return undefined;
	}

	const cookies = parseCookies(cookieHeader);

	// sveltekit-flash-message sets the `flash` cookie name internally.
	const flashCookie = cookies.flash;

	if (!flashCookie) {
		return undefined;
	}

	const flashData = JSON.parse(flashCookie);

	return flashData as PageMessages;
}
