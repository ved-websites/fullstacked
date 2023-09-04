import type { SessionUser } from '$/auth/auth-handler';
import { getNavElement, rolesIntersect } from '$/lib/components/nav/nav-elements';
import { handleLoginRedirect } from '$/lib/utils/login';
import { navElements } from '$/navigation/routes';
import type { RequestEvent } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';

export const urlsWhitelist: string[] = ['/', '/login', '/register'] satisfies `/${string}`[];

export function verifyUserAccess(event: RequestEvent) {
	const {
		locals: { sessionUser },
		url,
		route,
	} = event;

	// if no route id, this allow user to see 404 page
	if (!route.id) {
		return;
	}

	if (userCanAccessNav(sessionUser, navElements, url.pathname)) {
		return;
	}

	throw redirect(StatusCodes.SEE_OTHER, handleLoginRedirect(url));
}

/**
 * Checks if the logged-in user can access the nav element.
 *
 * If no nav element exists for the given path and user is logged-out, check for whitelist.
 * If no nav element exists for the given path but a user is logged-in, allow it.
 *
 * If no user but nav element found, check if the nav element is considered public.
 *
 * Finally, check roles for both user and nav element.
 */
export function userCanAccessNav(user: SessionUser, ...getNavElementArgs: Parameters<typeof getNavElement>) {
	const userToCheck = user;
	const currentNav = getNavElement(...getNavElementArgs);

	if (!currentNav) {
		if (!userToCheck) {
			// allow logged-out users to access whitelisted urls
			const [, route] = getNavElementArgs;

			return urlsWhitelist.includes(route);
		}

		return true;
	}

	if (!userToCheck) {
		return currentNav.isPublic;
	}

	if (!currentNav.roles || currentNav.roles.length === 0) {
		return true;
	}

	if (!userToCheck.roles?.length) {
		return false;
	}

	return rolesIntersect(
		currentNav.roles,
		userToCheck.roles.map((role) => role.text),
	);
}
