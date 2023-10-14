import { firstNameSchema, lastNameSchema } from '$lib/schemas/auth';
import { z } from 'zod';

export const userFormSchema = z.object({
	firstName: firstNameSchema,
	lastName: lastNameSchema,
});

export type UserFormSchemaType = typeof userFormSchema;
