import { c, wsC } from '~contract';
import { LiveUserSchema, UserRolesSchemaExtension, UserSchema } from '~shared';
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
		emitted: LiveUserSchema.extend(UserRolesSchemaExtension),
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
		emitted: UserSchema.extend(UserRolesSchemaExtension),
	},
	deleted: {
		type: 'delete',
		input: OptionalUserSpecifierSchema,
		emitted: UserSchema.pick({
			id: true,
		}),
	},
});
