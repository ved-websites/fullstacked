import { Roles } from './definitions';
import type { RoleSpec } from './roles.helper';

export function rolesIntersect(roles1: string[], roles2: string[]) {
	return roles1.some((role1) => roles2.some((role2) => role2 === role1));
}

export function rolesObjectIntersect(roles1: { text: string }[], roles2: { text: string }[]) {
	const rolesName1 = roles1.map((r) => r.text);
	const rolesName2 = roles2.map((r) => r.text);

	return rolesIntersect(rolesName1, rolesName2);
}

export function rolesSpecIntersects(roleSpecs: RoleSpec[], userRoles: string[]): boolean {
	return roleSpecs.some((roleSpec) => {
		const isSpecInUserRoles = userRoles.includes(roleSpec.name);

		if (isSpecInUserRoles) {
			return true;
		}

		if (roleSpec.contains) {
			return rolesSpecIntersects(roleSpec.contains, userRoles);
		}

		return false;
	});
}

export function userRolesHasAdmin(userRoles: string[]) {
	return userRoles.includes(Roles.ADMIN.name);
}

export function userHasRoleSpec(roleSpecs: RoleSpec[], userRoles: string[]) {
	const hasAdmin = userRolesHasAdmin(userRoles);

	if (hasAdmin) {
		return true;
	}

	return rolesSpecIntersects(roleSpecs, userRoles);
}
