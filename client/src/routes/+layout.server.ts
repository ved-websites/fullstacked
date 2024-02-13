import type { AppPageData } from '$app-types';
import { createLayoutAlert } from '$lib/components/LayoutAlert/helper';
import { HASJS_COOKIE_NAME } from '$lib/utils/js-handling';
import { loadFlash } from 'sveltekit-flash-message/server';
import { k } from '~shared';

export const load = loadFlash(async (event) => {
	const {
		cookies,
		isDataRequest,
		isSubRequest,
		url,
		depends,
		locals: { sessionUser, theme, userHasJs, browserLang },
	} = event;

	event.locals.step = 'layout';

	depends('data:sessionUser');

	if (!isDataRequest && !isSubRequest) {
		cookies.delete(HASJS_COOKIE_NAME, {
			path: '/',
		});
	}

	let layoutAlert: AppPageData['layoutAlert'];

	if (sessionUser === undefined) {
		layoutAlert = createLayoutAlert({
			text: k('common.errors.server.down'),
			i18nPayload: { userHasJs },
			type: 'error',
		});
	} else if (url.searchParams.has('forbidden')) {
		layoutAlert = createLayoutAlert({
			text: 'You cannot perform this action!', // TODO : i18n
			type: 'error',
		});
	}

	event.locals.step = 'page';

	return {
		sessionUser,
		theme,
		layoutAlert,
		userHasJs,
		browserLang,
	};
});
// }) satisfies LayoutServerLoad; // TODO: bugged out for some reason, retry after updating deps
