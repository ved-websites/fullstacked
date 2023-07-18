import { userCanAccessNav } from '$/lib/components/nav/nav-elements';
import { createLayoutAlert } from '$/lib/utils/layout-alert';
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
	};
}) satisfies LayoutServerLoad;
