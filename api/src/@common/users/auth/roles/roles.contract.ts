import RoleSchema from '$zod/modelSchema/RoleSchema';
import { z } from 'zod';
import { c, createResponses } from '~contract';

export const rolesContract = c.router(
	{
		list: {
			method: 'GET',
			path: '/roles',
			summary: 'Get the list of all roles.',
			responses: createResponses({
				200: z.array(RoleSchema.pick({ id: true, text: true })),
			}),
		},
	},
	{ pathPrefix: '/roles' },
);
