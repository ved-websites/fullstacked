import type { LayoutAlert } from '$/app';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ url, locals: { sessionUser } }) => {
	let layoutAlert: LayoutAlert | undefined;

	if (url.searchParams.get('forbidden') !== null) {
		layoutAlert = {
			text: 'You cannot perform this action!',
			level: 'error',
		};
	}

	return {
		sessionUser,
		layoutAlert,
	};
}) satisfies LayoutServerLoad;
