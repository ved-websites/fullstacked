export function handleRedirectTo(path: `/${string}`, toUrl: URL) {
	const redirectTo = toUrl.pathname + toUrl.search;

	if (path === toUrl.pathname) {
		return redirectTo;
	}

	return `${path}?redirectTo=${redirectTo}`;
}
