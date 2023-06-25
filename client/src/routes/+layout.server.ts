import type { LayoutAlert } from '$/app';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ url, locals: { user } }) => {
	let layoutAlert: LayoutAlert | undefined;

	if (url.searchParams.get('forbidden') !== null) {
		layoutAlert = {
			text: 'You cannot perform this action!',
			level: 'error',
		};
	}

	return {
		user,
		layoutAlert,
	};
}) satisfies LayoutServerLoad;
