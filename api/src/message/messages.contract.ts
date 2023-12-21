import { MessageSchema, UserSchema } from '$zod';
import { z } from 'zod';
import { c, createResponses } from '~contract';

export const messagesContract = c.router(
	{
		list: {
			method: 'GET',
			path: '/',
			summary: 'Get a list of all the recent messages.',
			responses: createResponses({
				200: z.array(
					MessageSchema.omit({ userId: true }).extend({
						user: UserSchema.pick({
							email: true,
							firstName: true,
							lastName: true,
							profilePictureRef: true,
						}),
					}),
				),
			}),
		},
		new: {
			method: 'POST',
			path: '/',
			summary: 'Post a new message',
			body: z.object({
				text: z.string(),
			}),
			responses: createResponses({
				200: z.undefined(),
			}),
		},
	},
	{ pathPrefix: '/messages' },
);
