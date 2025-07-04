import { handleRedirectTo } from './redirecting';

export function handleLoginRedirect(url: URL) {
	return handleRedirectTo('/login', url);
}

export function handleAccessRedirect(url: URL) {
	const pathTo = url.pathname + url.search;

	// if (pathTo.includes('@')) {
	// 	return '/no-access';
	// }

	return `/no-access?pathTo=${pathTo}`;
}
