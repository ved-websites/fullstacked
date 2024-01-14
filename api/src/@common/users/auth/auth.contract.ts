import type { Role } from '$prisma-client';
import { RoleSchema, UserSchema } from '$zod';
import { z } from 'zod';
import { c, createResponses, wsC } from '~contract';
import type { LiveUser } from './types';

export const authContract = c.router(
	{
		session: {
			method: 'GET',
			path: '/session',
			summary: 'Get the current user session.',
			responses: createResponses({
				200: z.null().or(
					UserSchema.extend({
						roles: RoleSchema.array(),
					}),
				),
			}),
		},
	},
	{ pathPrefix: '/auth' },
);

export const wsAuthContract = wsC.router({
	update: {
		type: 'update',
		input: z
			.object({
				email: z.string().optional(),
			})
			.optional(),
		emitted: wsC.type<LiveUser & { roles: Role[] }>(),
	},
});
