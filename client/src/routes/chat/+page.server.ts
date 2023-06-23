import type { PageServerLoad } from './$types';

export const load = (async ({ locals: { getUser } }) => {
	return {
		user: await getUser(),
	};
}) satisfies PageServerLoad;
