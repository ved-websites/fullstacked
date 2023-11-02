import { userFormSchema } from '$lib/components/UserForm/userform.schema';
import { emailSchema } from '$lib/schemas/auth';
import { z } from 'zod';

export const adminUserFormSchema = userFormSchema.augment({
	roles: z.array(z.string()),
});

export const adminNewUserFormSchema = adminUserFormSchema.augment({
	email: emailSchema,
	emailLang: z.string(),
});
