import RoleSchema from '$zod/modelSchema/RoleSchema';
import { z } from 'zod/v4';
import { c, createResponses } from '~contract';
import { UserSchema, emailSchema, passwordSchema } from '~shared';

export const SessionUserSchema = UserSchema.extend({
	roles: RoleSchema.omit({ createdAt: true }).array(),
});

export const RegisterTokenSchema = z.string().meta({ description: 'Registration Token' });
export const ResetPasswordTokenSchema = z.string().meta({ description: 'Reset Password Token' });

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
		forgotPasswordRequest: {
			method: 'GET',
			query: z.object({
				email: emailSchema,
			}),
			path: '/forgot-password-request',
			summary: 'Request a reset password email.',
			responses: createResponses({
				200: ResetPasswordTokenSchema,
			}),
		},
		verifyPasswordResetAttempt: {
			method: 'GET',
			query: z.object({
				resetToken: ResetPasswordTokenSchema,
			}),
			path: '/verify-password-reset-token',
			summary: 'Verifies if the reset token provided is valid or not.',
			responses: createResponses({
				200: UserSchema.pick({
					email: true,
				}),
			}),
		},
		resetPassword: {
			method: 'POST',
			body: z.object({
				resetToken: ResetPasswordTokenSchema,
				password: passwordSchema,
			}),
			path: '/reset-password',
			summary: 'Sends the reset password data.',
			responses: createResponses({
				200: z.boolean(),
			}),
		},
	},
	{ pathPrefix: '/auth' },
);
