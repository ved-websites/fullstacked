import { emailSchema, firstNameSchema, lastNameSchema } from '$/lib/schemas/auth';
import { z } from 'zod';

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = ['jpeg', 'jpg', 'png', 'webp'];

export const userFormSchema = z.object({
	email: emailSchema,
	firstName: firstNameSchema,
	lastName: lastNameSchema,
	roles: z.array(z.string()),
	profilePicture: z.optional(
		z
			.any()
			.refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
			.refine(
				(file) => ACCEPTED_IMAGE_TYPES.map((type) => `image/${type}`).includes(file?.type),
				`Format accepted : ${ACCEPTED_IMAGE_TYPES.join(', ')}.`,
			),
	),
});
