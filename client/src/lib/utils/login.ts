import type { RequestEvent } from '@sveltejs/kit';

export function handleLoginRedirect(url: RequestEvent['url']) {
	const redirectTo = url.pathname + url.search;

	// if (redirectTo.includes('@')) {
	// 	return '/login';
	// }

	return `/login?redirectTo=${redirectTo}`;
}

export function handleAccessRedirect(url: RequestEvent['url']) {
	const pathTo = url.pathname + url.search;

	// if (pathTo.includes('@')) {
	// 	return '/no_access';
	// }

	return `/no_access?pathTo=${pathTo}`;
}
