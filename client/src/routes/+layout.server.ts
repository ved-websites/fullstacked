import type { AppPageData } from '$app-types';
import { createLayoutAlert } from '$lib/components/LayoutAlert/helper';
import type { ToastData } from '$lib/components/ToastManager/helper';
import { HASJS_COOKIE_NAME } from '$lib/utils/js-handling';
import type { LayoutServerLoad } from './$types';

export const load = (async (event) => {
	const {
		cookies,
		isDataRequest,
		isSubRequest,
		url,
		depends,
		locals: { sessionUser, theme, userHasJs, browserLang },
	} = event;

	depends('data:sessionUser');

	if (!isDataRequest && !isSubRequest) {
		cookies.delete(HASJS_COOKIE_NAME, {
			path: '/',
		});
	}

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
		userHasJs,
		browserLang,
	};
}) satisfies LayoutServerLoad;
