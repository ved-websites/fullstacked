import type { SessionUser } from '$/hooks.server';
import type { NavElement } from './nav-elements';

export function userHasRole(user: SessionUser, ...roles: string[]) {
	if (!user) {
		return false;
	}

	return roles.some((role) => user.roles?.some((userRole) => userRole.text === role));
}

export function isNavElemVisible(navElem: NavElement, user: SessionUser): boolean {
	if (navElem.isPublic) {
		return true;
	}
	if (user == null) {
		return false;
	}

	if (!navElem.roles || !navElem.roles.length) {
		return true;
	}

	return userHasRole(user, ...navElem.roles);
}
