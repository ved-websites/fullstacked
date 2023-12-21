import type { User } from '$prisma-client';
import { RoleSchema, UserFindManyArgsSchema, UserSchema } from '$zod';
import { z } from 'zod';
import { c, createResponses } from '~contract';

export const adminContract = c.router(
	{
		listUsers: {
			method: 'GET',
			path: '/users',
			summary: 'Get a list of all users for administrative usage.',
			responses: createResponses({
				200: z.array(
					UserSchema.extend({
						online: z.boolean(),
						roles: z.array(RoleSchema),
					}),
				),
			}),
		},
		listUsersGQL: {
			method: 'GET',
			path: '/users-gql',
			summary: 'Get a list of all users for administrative usage.',
			query: c.type<z.infer<typeof UserFindManyArgsSchema> & { select?: { online?: boolean } }>(),
			// query: UserFindManyArgsSchema.merge({
			// 	select: UserSelectSchema.extend({ online: z.boolean().optional() }).optional(),
			// }),
			// query: c.type<{ select?: Prisma.UserSelect & { online?: boolean } } & FindManyUserArgs>(),
			responses: createResponses({
				200: c.type<Partial<User & { online: boolean }>[]>(),
			}),
		},
	},
	{
		pathPrefix: '/admins',
	},
);
