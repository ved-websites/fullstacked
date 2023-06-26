import { z } from 'zod';

export const userFormSchema = z.object({
	email: z.string().email(),
	firstName: z.nullable(z.string()),
	lastName: z.nullable(z.string()),
	roles: z.array(z.object({ value: z.string(), name: z.string() })),
});
