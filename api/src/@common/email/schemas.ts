import env from '$configs';
import { z } from 'zod';
import { emailSchema, fullNameSchema } from '~shared';

const optionalName = fullNameSchema.optional().transform((v) => (v === null ? undefined : v) as typeof v);

export const emailUserDetails = z.object({
	email: emailSchema,
	name: optionalName,
});

export const simpleEmailUser = emailSchema.transform((email) => ({ email }) satisfies z.input<typeof emailUserDetails>);

export const emailUserSchema = z.union([simpleEmailUser, emailUserDetails]);

export const multipleEmailUsersSchema = z.union([emailUserSchema.transform((v) => [v]), z.array(emailUserSchema)]);

export const sendEmailSchema = z.object({
	to: multipleEmailUsersSchema,
	from: simpleEmailUser
		.optional()
		.default(env.EMAIL_FROM)
		.or(emailUserDetails.extend({ email: emailSchema.optional().default(env.EMAIL_FROM) })),
	subject: z.string(),
	html: z.string(),
	cc: multipleEmailUsersSchema.optional(),
	bcc: multipleEmailUsersSchema.optional(),
	replyTo: multipleEmailUsersSchema.optional(),
});

export type SendMailData = z.input<typeof sendEmailSchema>;
