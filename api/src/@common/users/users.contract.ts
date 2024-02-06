import RoleSchema from '$zod/modelSchema/RoleSchema';
import UserSchema from '$zod/modelSchema/UserSchema';
import { c, wsC } from '~contract';
import { LiveUserSchema } from '~shared';
import { adminContract } from './admin/admin.contract';

export const usersContract = c.router({
	admin: adminContract,
});

export const OptionalUserSpecifierSchema = UserSchema.pick({
	id: true,
}).partial();

export const wsUsersContract = wsC.router({
	edited: {
		type: 'update',
		input: OptionalUserSpecifierSchema,
		emitted: LiveUserSchema.extend({
			roles: RoleSchema.array(),
		}),
	},
	onlineChange: {
		type: 'update',
		input: OptionalUserSpecifierSchema,
		emitted: LiveUserSchema.pick({
			id: true,
			online: true,
		}),
	},
	created: {
		type: 'create',
		input: OptionalUserSpecifierSchema,
		emitted: UserSchema.extend({
			roles: RoleSchema.array(),
		}),
	},
	deleted: {
		type: 'delete',
		input: OptionalUserSpecifierSchema,
		emitted: LiveUserSchema.pick({
			id: true,
		}),
	},
});
