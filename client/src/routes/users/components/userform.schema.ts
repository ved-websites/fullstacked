import { emailSchema, firstNameSchema, lastNameSchema } from '$/lib/schemas/auth';
import { z } from 'zod';

export const MAX_PROFILE_PICTURE_FILE_SIZE = 500000;
export const ACCEPTED_PROFILE_PICTURE_TYPES = ['jpeg', 'jpg', 'png', 'webp'];

export const userFormSchema = z.object({
	email: emailSchema,
	firstName: firstNameSchema,
	lastName: lastNameSchema,
	roles: z.array(z.string()),
	profilePictureFile: z.optional(
		z
			.any()
			// .instanceof(File)
			.refine((file) => file.size <= MAX_PROFILE_PICTURE_FILE_SIZE, `Max image size is 5MB.`)
			.refine(
				(file) => ACCEPTED_PROFILE_PICTURE_TYPES.map((type) => `image/${type}`).includes(file.type),
				`Format accepted : ${ACCEPTED_PROFILE_PICTURE_TYPES.join(', ')}.`,
			),
	),
});
