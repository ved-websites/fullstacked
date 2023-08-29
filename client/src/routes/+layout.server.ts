import type { AppPageData } from '$/app';
import { createLayoutAlert } from '$/lib/components/LayoutAlert/helper';
import type { ToastData } from '$/lib/components/ToastManager/helper';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ url, locals: { sessionUser, theme } }) => {
	let layoutAlert: AppPageData['layoutAlert'];

	if (url.searchParams.has('forbidden')) {
		layoutAlert = createLayoutAlert({
			text: 'You cannot perform this action!',
			level: 'error',
		});
	}

	return {
		sessionUser,
		theme,
		layoutAlert,
		toasts: [] as ToastData[],
	};
}) satisfies LayoutServerLoad;
