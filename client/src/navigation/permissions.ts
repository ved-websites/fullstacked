import type { SessionUser } from '$auth/auth-handler';
import { getNavElement, type NavElement } from '$lib/components/nav/nav-elements';
import { handleAccessRedirect, handleLoginRedirect } from '$lib/utils/login';
import { navElements } from '$navigation/routes';
import type { RequestEvent } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { userHasRoleSpec } from '~shared';

/** List of urls available to logged out users. */
export const urlsWhitelist: string[] = ['/', '/login', '/register', '/forgot-password'] satisfies `/${string}`[];

export function verifyUserAccess(event: RequestEvent) {
	const {
		locals: { sessionUser },
		url,
		route,
	} = event;

	// if no route id, this allow user to see 404 page
	if (!route.id) {
		return true;
	}

	if (userCanAccessNav(sessionUser, navElements, url)) {
		if (url.pathname == '/no-access') {
			const pathTo = url.searchParams.get('pathTo');

			if (pathTo) {
				redirect(StatusCodes.SEE_OTHER, `/${pathTo.substring(1)}`);
			}
		}

		return true;
	}

	if (sessionUser) {
		if (url.pathname == '/no-access') {
			return true;
		} else {
			redirect(StatusCodes.SEE_OTHER, handleAccessRedirect(url));
		}
	}

	redirect(StatusCodes.SEE_OTHER, handleLoginRedirect(url));
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
export function userCanAccessNav(user: SessionUser, navElements: NavElement[], url: URL) {
	const pathname = (() => {
		if (url.pathname === '/no-access' && url.searchParams.has('pathTo')) {
			return url.searchParams.get('pathTo')!;
		}

		return url.pathname;
	})();

	const currentNav = getNavElement(navElements, pathname);

	if (!currentNav) {
		if (!user) {
			// allow logged-out users to access whitelisted urls
			return urlsWhitelist.includes(pathname);
		}

		return true;
	}

	if (!user) {
		return Boolean(currentNav.isPublic);
	}

	if (!currentNav.roles || currentNav.roles.length === 0) {
		return true;
	}

	if (!user.roles?.length) {
		return false;
	}

	return userHasRoleSpec(
		currentNav.roles,
		user.roles.map((role) => role.text),
	);
}
