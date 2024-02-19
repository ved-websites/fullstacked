import type UserUpdateInputSchema from '$zod/inputTypeSchemas/UserUpdateInputSchema';
import { z } from 'zod';
import { c, createResponses } from '~contract';
import { emailSchema } from '~shared';

export const userProfileContract = c.router(
	{
		update: {
			method: 'POST',
			body: c.type<Omit<z.output<typeof UserUpdateInputSchema>, 'email' | 'hashedPassword'>>(),
			path: '/',
			summary: 'Update your own user profile.',
			responses: createResponses({
				200: z.undefined(),
			}),
		},
		uploadPicture: {
			method: 'POST',
			body: c.type<{ file: File }>(),
			path: '/picture',
			contentType: 'multipart/form-data',
			summary: 'Deletes your own profile picture.',
			responses: createResponses({
				200: z.undefined(),
			}),
		},
		deletePicture: {
			method: 'DELETE',
			body: z.undefined(),
			path: '/picture',
			summary: 'Deletes your own profile picture.',
			responses: createResponses({
				200: z.undefined(),
			}),
		},
		requestUpdateEmail: {
			method: 'PUT',
			body: z.object({ email: emailSchema }),
			path: '/email',
			summary: `Request to update your own email.`,
			responses: createResponses({
				200: z.object({
					success: z.boolean(),
				}),
			}),
		},
		updateEmail: {
			method: 'POST',
			body: z.object({ token: z.string() }),
			path: '/email',
			summary: `Update your own email.`,
			responses: createResponses({
				200: z.object({
					success: z.boolean(),
				}),
			}),
		},
	},
	{ pathPrefix: '/profile' },
);
