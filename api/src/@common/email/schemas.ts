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
	from: senderSchema,
	subject: z.string(),
	html: z.string(),
	cc: senderSchema.optional(),
	bcc: senderSchema.optional(),
	replyTo: senderSchema.optional(),
});

export type SendMailData = ReturnType<typeof sendEmailSchema.parse>;
