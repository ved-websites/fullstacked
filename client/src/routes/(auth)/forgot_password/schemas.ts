import { emailSchema, passwordSchema } from '$lib/schemas/auth';
import { z } from 'zod';

export const requestPasswordSchema = z.object({
	email: emailSchema,
});

export const resetPasswordSchema = z.object({
	password: passwordSchema,
	token: z.string(),
});
