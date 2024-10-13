export function reconstructUrl(url: URL, searchParams?: URLSearchParams) {
	const params = searchParams ?? url.searchParams;

	const paramsString = params.size > 0 ? `?${params.toString()}` : '';

	return `${url.pathname}${paramsString}`;
}

export function reconstructUrlWithOrigin(url: URL, searchParams?: URLSearchParams) {
	const path = reconstructUrl(url, searchParams);

	return `${url.origin}${path}`;
}

export function stringParamsFromUrl(url: URL, ...keys: string[]) {
	const params = new URLSearchParams(url.search);

	keys.forEach((key) => params.has(key) && params.delete(key));

	return reconstructUrl(url, params);
}
