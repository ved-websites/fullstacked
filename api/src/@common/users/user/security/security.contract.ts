import { z } from 'zod';
import { c, createResponses } from '~contract';
import { emailSchema, passwordSchema } from '~shared';

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
	requestUpdateEmail: {
		method: 'PUT',
		body: z.object({ email: emailSchema }),
		path: '/email',
		summary: `Request to update your own email.`,
		responses: createResponses({
			200: z.object({
				success: z.boolean(),
			}),
		}),
	},
	updateEmail: {
		method: 'POST',
		body: z.object({ token: z.string() }),
		path: '/email',
		summary: `Update your own email.`,
		responses: createResponses({
			200: z.object({
				success: z.boolean(),
			}),
		}),
	},
});
