import { firstNameSchema, lastNameSchema } from '$lib/schemas/auth';
import { z } from 'zod';
import { passwordSchema } from '~shared';

export const registerSchema = z.object({
	registerToken: z.string(),
	firstName: firstNameSchema,
	lastName: lastNameSchema,
	password: passwordSchema,
});
