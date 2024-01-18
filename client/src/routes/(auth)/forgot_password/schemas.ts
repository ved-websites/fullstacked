import { z } from 'zod';
import { emailSchema, passwordSchema } from '~shared';

export const requestPasswordSchema = z.object({
	email: emailSchema,
});

export const resetPasswordSchema = z.object({
	password: passwordSchema,
	token: z.string(),
});
