import type { RequestEvent } from '@sveltejs/kit';

export function handleLoginRedirect(url: RequestEvent['url']) {
	const redirectTo = url.pathname + url.search;

	if (redirectTo.includes('@')) {
		return '/login';
	}

	return `/login?redirectTo=${redirectTo}`;
}
