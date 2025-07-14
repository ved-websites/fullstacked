import MessageSchema from '$zod/modelSchema/MessageSchema';
import { z } from 'zod/v4';
import { c, createResponses, wsC } from '~contract';
import { UserSchema } from '~shared';

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

export const wsMessagesContract = wsC.router({
	new: {
		type: 'create',
		// emitted: wsC.type<Message & { user: User }>(),
		emitted: MessageSchema.extend({
			user: UserSchema,
		}),
	},
});
