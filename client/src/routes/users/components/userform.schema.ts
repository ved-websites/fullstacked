import { emailSchema, firstNameSchema, lastNameSchema } from '$/lib/schemas/auth';
import { z } from 'zod';

export const userFormSchema = z.object({
	email: emailSchema,
	firstName: firstNameSchema,
	lastName: lastNameSchema,
	roles: z.array(z.string()),
});
