export function reconstructUrl(url: URL, searchParams?: URLSearchParams) {
	const params = searchParams ?? url.searchParams;

	const paramsString = params.size > 0 ? `?${params.toString()}` : '';

	return `${url.origin}${url.pathname}${paramsString}`;
}

export function stringParamsFromUrl(url: URL, ...keys: string[]) {
	const params = new URLSearchParams(url.search);

	keys.forEach((key) => params.has(key) && params.delete(key));

	return reconstructUrl(url, params);
}
