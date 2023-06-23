import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals: { getUser } }) => {
	return {
		user: await getUser(),
	};
}) satisfies LayoutServerLoad;
