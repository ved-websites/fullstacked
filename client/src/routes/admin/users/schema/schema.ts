import { userFormSchema } from '$lib/components/UserForm/userform.schema';
import { z } from 'zod';
import { emailSchema } from '~shared';

export const adminUserFormSchema = userFormSchema.augment({
	roles: z.array(z.string()),
});

export const adminNewUserFormSchema = adminUserFormSchema.augment({
	email: emailSchema,
	emailLang: z.string(),
});
