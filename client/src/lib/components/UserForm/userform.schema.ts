import { firstNameSchema, lastNameSchema } from '$lib/schemas/auth';
import { z } from 'zod/v4';

export const userFormSchema = z.object({
	firstName: firstNameSchema,
	lastName: lastNameSchema,
});

export type UserFormSchemaType = z.output<typeof userFormSchema>;
