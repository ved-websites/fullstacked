import type { AppPageData } from '$/app';
import { createLayoutAlert } from '$/lib/components/LayoutAlert/helper';
import { userCanAccessNav } from '$/lib/components/nav/nav-elements';
import type { ToastData } from '$/lib/components/ToastManager/helper';
import { handleLoginRedirect } from '$/lib/utils/login';
import { navElements } from '$/navigation';
import { redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ url, locals: { sessionUser, theme } }) => {
	let layoutAlert: AppPageData['layoutAlert'];

	if (!userCanAccessNav(sessionUser, navElements, url.pathname)) {
		throw redirect(StatusCodes.SEE_OTHER, handleLoginRedirect(url));
	}

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
