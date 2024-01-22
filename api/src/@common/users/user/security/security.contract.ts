import { z } from 'zod';
import { c, createResponses } from '~contract';
import { passwordSchema } from '~shared';

export const userSecurityContract = c.router({
	changePassword: {
		method: 'POST',
		body: z.object({
			password: passwordSchema,
		}),
		path: '/',
		summary: 'Change your own password.',
		responses: createResponses({
			200: z.undefined(),
		}),
	},
});
