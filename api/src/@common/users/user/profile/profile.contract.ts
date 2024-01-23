import UserUpdateInputSchema from '$zod/inputTypeSchemas/UserUpdateInputSchema';
import { z } from 'zod';
import { c, createResponses } from '~contract';

export const userProfileContract = c.router(
	{
		update: {
			method: 'POST',
			body: UserUpdateInputSchema,
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
			body: z.object({}),
			path: '/picture',
			summary: 'Deletes your own profile picture.',
			responses: createResponses({
				200: z.undefined(),
			}),
		},
	},
	{ pathPrefix: '/profile' },
);
