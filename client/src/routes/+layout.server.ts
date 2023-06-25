import type { LayoutAlert } from '$/app';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	return {
		user: locals.user,
		layoutAlert: undefined as LayoutAlert | undefined,
	};
}) satisfies LayoutServerLoad;
