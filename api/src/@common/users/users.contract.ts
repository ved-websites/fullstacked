import RoleSchema from '$zod/modelSchema/RoleSchema';
import UserSchema from '$zod/modelSchema/UserSchema';
import { z } from 'zod';
import { c, wsC } from '~contract';
import { LiveUserSchema, emailSchema } from '~shared';
import { adminContract } from './admin/admin.contract';

export const usersContract = c.router({
	admin: adminContract,
});

export const OptionalEmailSpecifierSchema = z.object({
	email: emailSchema.optional(),
});

export const wsUsersContract = wsC.router({
	edited: {
		type: 'update',
		input: OptionalEmailSpecifierSchema,
		emitted: LiveUserSchema.extend({
			roles: RoleSchema.array(),
		}),
	},
	onlineChange: {
		type: 'update',
		input: OptionalEmailSpecifierSchema,
		emitted: LiveUserSchema.pick({
			email: true,
			online: true,
		}),
	},
	created: {
		type: 'create',
		input: OptionalEmailSpecifierSchema,
		emitted: UserSchema.extend({
			roles: RoleSchema.array(),
		}),
	},
	deleted: {
		type: 'delete',
		input: OptionalEmailSpecifierSchema,
		emitted: LiveUserSchema.pick({
			email: true,
		}),
	},
});
