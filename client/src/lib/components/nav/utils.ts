import type { SessionUser } from '$auth/auth-handler';
import { userHasRoleSpec } from '~shared';
import type { NavElement } from './nav-elements';

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

	const userRoles = user.roles.map((role) => role.text);

	return userHasRoleSpec(navElem.roles, userRoles);
}
