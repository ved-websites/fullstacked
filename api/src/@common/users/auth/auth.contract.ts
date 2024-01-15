import { RoleSchema, UserSchema } from '$zod';
import { z } from 'zod';
import { c, createResponses, wsC } from '~contract';

export const SessionUserSchema = UserSchema.extend({
	roles: RoleSchema.omit({ createdAt: true }).array(),
});

export const authContract = c.router(
	{
		session: {
			method: 'GET',
			path: '/session',
			summary: 'Get the current user session.',
			responses: createResponses({
				200: z.null().or(SessionUserSchema),
			}),
		},
	},
	{ pathPrefix: '/auth' },
);

export const wsAuthContract = wsC.router({
	session: {
		type: 'update',
		emitted: SessionUserSchema,
	},
});
