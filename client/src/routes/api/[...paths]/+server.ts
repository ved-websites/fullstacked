import { getApiUrl } from '$lib/utils';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ fetch, request, params }) => {
	const apiUrl = getApiUrl(`/api/${params.paths}`);

	const body = await request.json();

	const res = await fetch(apiUrl.href, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});

	return res;
};
