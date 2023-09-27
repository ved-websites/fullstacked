import type { AppPageData } from '$/app';
import { createLayoutAlert } from '$/lib/components/LayoutAlert/helper';
import type { ToastData } from '$/lib/components/ToastManager/helper';
import { HASJS_COOKIE_NAME } from '$/lib/utils/js-handling';
import { getUserLang } from '$/lib/utils/lang';
import type { LayoutServerLoad } from './$types';

export const load = (async (event) => {
	const {
		cookies,
		isDataRequest,
		isSubRequest,
		url,
		depends,
		locals: { sessionUser, theme, userHasJs },
	} = event;

	depends('data:sessionUser');

	const lang = getUserLang(event);

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
		lang,
	};
}) satisfies LayoutServerLoad;
