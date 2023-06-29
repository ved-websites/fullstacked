import { emailSchema } from '$/lib/schemas/auth';
import { z } from 'zod';

export const simpleSenderSchema = z.union([
	emailSchema,
	z.object({
		email: emailSchema,
		name: z.optional(z.string()),
	}),
]);

export const senderSchema = z.union([simpleSenderSchema, z.array(simpleSenderSchema)]);

export const sendEmailSchema = z.object({
	to: senderSchema,
	from: senderSchema,
	subject: z.string(),
	html: z.string(),
	cc: z.optional(senderSchema),
	bcc: z.optional(senderSchema),
	replyTo: z.optional(senderSchema),
});

export type SendMailData = ReturnType<typeof sendEmailSchema.parse>;
