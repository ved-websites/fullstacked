import { createLayoutAlert } from '$/lib/components/LayoutAlert/helper';
import type { ToastData } from '$/lib/components/ToastManager/helper';
import { userCanAccessNav } from '$/lib/components/nav/nav-elements';
import { handleLoginRedirect } from '$/lib/utils/login';
import { navElements } from '$/navigation';
import { redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ url, locals: { sessionUser } }) => {
	let layoutAlert: Awaited<ReturnType<LayoutServerLoad>>['layoutAlert'];

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
		layoutAlert,
		toasts: [] as ToastData[],
	};
}) satisfies LayoutServerLoad;
