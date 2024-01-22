import RoleSchema from '$zod/modelSchema/RoleSchema';
import { z } from 'zod';
import { c, wsC } from '~contract';
import { LiveUserSchema, emailSchema } from '~shared';
import { adminContract } from './admin/admin.contract';

export const usersContract = c.router({
	admin: adminContract,
});

export const wsUsersContract = wsC.router({
	edited: {
		type: 'update',
		input: z.object({
			email: emailSchema.optional(),
		}),
		emitted: LiveUserSchema.extend({
			roles: RoleSchema.array(),
		}),
	},
	onlineChange: {
		type: 'update',
		input: z.object({
			email: emailSchema.optional(),
		}),
		emitted: LiveUserSchema.pick({
			email: true,
			online: true,
		}),
	},
});
