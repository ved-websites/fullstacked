import env from '$configs';
import { z } from 'zod';
import { emailSchema, fullNameSchema } from '~shared';

const optionalName = fullNameSchema.optional().transform((v) => (v === null ? undefined : v) as typeof v);

export const simpleSenderSchema = z.union([
	emailSchema,
	z.object({
		email: emailSchema,
		name: optionalName,
	}),
]);

export const senderSchema = z.union([simpleSenderSchema, z.array(simpleSenderSchema)]);

export const sendEmailSchema = z.object({
	to: senderSchema,
	from: emailSchema
		.optional()
		.default(env.EMAIL_FROM)
		.or(
			z.object({
				email: emailSchema.optional().default(env.EMAIL_FROM),
				name: optionalName,
			}),
		),
	subject: z.string(),
	html: z.string(),
	cc: senderSchema.optional(),
	bcc: senderSchema.optional(),
	replyTo: senderSchema.optional(),
});

export type SendMailData = z.input<typeof sendEmailSchema>;
