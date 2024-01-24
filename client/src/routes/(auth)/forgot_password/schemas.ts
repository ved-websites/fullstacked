import { z } from 'zod';
import { emailSchema, k, passwordSchema } from '~shared';

export const requestPasswordSchema = z.object({
	email: emailSchema,
});

export const resetPasswordSchema = z.object({
	password: passwordSchema,
	resetToken: z.string({ required_error: k('(auth).forgot_password.reset.action.no-token') }),
});
