import { RoleSchema, UserSchema } from '$zod';
import { z } from 'zod';
import { c, createResponses, wsC } from '~contract';

export const SessionUserSchema = UserSchema.extend({
	roles: RoleSchema.omit({ createdAt: true }).array(),
});

export const RegisterTokenSchema = z.string({ description: 'Registration Token' });

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
		login: {
			method: 'POST',
			body: z.object({
				email: z.string().email(),
				password: z.string(),
			}),
			path: '/login',
			summary: 'Login.',
			responses: createResponses({
				200: z.object({
					accessToken: z.string(),
				}),
			}),
		},
		logout: {
			method: 'POST',
			body: null,
			path: '/logout',
			summary: 'Logout of the current user session.',
			responses: createResponses({
				200: z.boolean(),
			}),
		},
		initRegistration: {
			method: 'GET',
			query: z.object({
				registerToken: RegisterTokenSchema,
			}),
			path: '/init-registration',
			summary: 'Starts the registration process by getting your basic user',
			responses: createResponses({
				200: UserSchema.pick({
					email: true,
					firstName: true,
					lastName: true,
				}),
			}),
		},
		register: {
			method: 'POST',
			body: z.object({
				registerToken: RegisterTokenSchema,
				password: z.string(),
				user: UserSchema.pick({
					firstName: true,
					lastName: true,
				}),
			}),
			path: '/register',
			summary: 'Sends the registration form.',
			responses: createResponses({
				200: z.boolean(),
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
