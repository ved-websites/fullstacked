import type { ClientUser } from '$/hooks.server';
import type { NavElement } from './nav-elements';

export function userHasRole(user: ClientUser, ...roles: string[]) {
	if (!user) {
		return false;
	}

	return roles.some((role) => user.roles?.some((userRole) => userRole.text === role));
}

export function isNavElemVisible(navElem: NavElement, user: ClientUser): boolean {
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
