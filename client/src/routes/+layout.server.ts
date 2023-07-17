import type { LayoutAlert } from '$/app';
import { createLayoutAlert } from '$/lib/utils/layout-alert';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ url, locals: { sessionUser } }) => {
	let layoutAlert: LayoutAlert | undefined;

	if (url.searchParams.get('forbidden') !== null) {
		layoutAlert = createLayoutAlert({
			text: 'You cannot perform this action!',
			level: 'error',
		});
	}

	return {
		sessionUser,
		layoutAlert,
	};
}) satisfies LayoutServerLoad;
