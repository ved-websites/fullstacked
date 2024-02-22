export * from './roles.helper';

import { createRoles, type RoleSpec } from './roles.helper';

export const Roles = createRoles({
	ADMIN: { name: 'admin', sudo: true },
	CHAT: 'chat',
});

export const specRolesMap: RoleSpec[] = Object.values(Roles);

export * from './utils';
