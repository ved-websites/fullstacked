import type { ClientUser } from '$/hooks.server';
import { getNavElement, rolesIntersect } from '$/lib/components/nav/nav-elements';
import { handleLoginRedirect } from '$/lib/utils/login';
import { navElements } from '$/navigation/routes';
import type { RequestEvent } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';

export function verifyUserAccess(event: RequestEvent) {
	const {
		locals: { sessionUser },
		url,
	} = event;

	if (!userCanAccessNav(sessionUser, navElements, url.pathname)) {
		throw redirect(StatusCodes.SEE_OTHER, handleLoginRedirect(url));
	}
}

export function userCanAccessNav(user: ClientUser, ...getNavElementArgs: Parameters<typeof getNavElement>) {
	const userToCheck = user;
	const currentNav = getNavElement(...getNavElementArgs);

	if (!currentNav) {
		return true;
	}

	if (!userToCheck) {
		return currentNav.isPublic;
	}

	if (!currentNav.roles?.length || !userToCheck.roles?.length) {
		return true;
	}

	return rolesIntersect(
		currentNav.roles,
		userToCheck.roles.map((role) => role.text),
	);
}
