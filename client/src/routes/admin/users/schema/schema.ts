import { userFormSchema } from '$lib/components/UserForm/userform.schema';
import { z } from 'zod';
import { emailSchema } from '~shared';

export const adminUserFormSchema = userFormSchema.extend({
	roles: z.array(z.string()),
});

export const adminNewUserFormSchema = adminUserFormSchema.extend({
	email: emailSchema,
	emailLang: z.string(),
});
