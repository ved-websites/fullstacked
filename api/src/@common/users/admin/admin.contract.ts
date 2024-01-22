import type { User } from '$prisma-client';
import type UserUpdateInputSchema from '$zod/inputTypeSchemas/UserUpdateInputSchema';
import RoleSchema from '$zod/modelSchema/RoleSchema';
import UserSchema from '$zod/modelSchema/UserSchema';
import type UserFindManyArgsSchema from '$zod/outputTypeSchemas/UserFindManyArgsSchema';
import { z } from 'zod';
import { c, createResponses } from '~contract';
import { LiveUserSchema, emailSchema } from '~shared';

export type AdminListUsersGql = z.infer<typeof UserFindManyArgsSchema> & { select?: { online?: boolean } };

export const adminContract = c.router(
	{
		listUsers: {
			method: 'GET',
			path: '/users',
			summary: 'Get a list of all users for administrative usage.',
			responses: createResponses({
				200: z.array(
					LiveUserSchema.extend({
						roles: z.array(RoleSchema),
					}),
				),
			}),
		},
		listUsersGQL: {
			method: 'GET',
			path: '/users-gql',
			summary: 'Get a list of all users for administrative usage.',
			query: c.type<AdminListUsersGql>(),
			// query: UserFindManyArgsSchema.merge({
			// 	select: UserSelectSchema.extend({ online: z.boolean().optional() }).optional(),
			// }),
			// query: c.type<{ select?: Prisma.UserSelect & { online?: boolean } } & FindManyUserArgs>(),
			responses: createResponses({
				200: c.type<Partial<User & { online: boolean }>[]>(),
			}),
		},
		getUserForEdit: {
			method: 'GET',
			path: '/user',
			summary: 'Get user to edit as admin.',
			query: z.object({
				email: emailSchema,
			}),
			responses: createResponses({
				200: z.object({
					user: UserSchema.extend({
						roles: z.array(RoleSchema.pick({ text: true })),
					}),
					roles: z.array(RoleSchema.pick({ id: true, text: true })),
				}),
			}),
		},
		editUser: {
			method: 'POST',
			path: '/user',
			summary: 'Edits a user as admin.',
			body: c.type<
				Pick<z.output<typeof UserUpdateInputSchema>, 'firstName' | 'lastName' | 'roles'> & {
					userRef: z.output<typeof emailSchema>;
				}
			>(),
			// body: UserSchema.partial().merge(
			// 	z.object({
			// 		roles: RoleWhereUniqueInputSchema,
			// 	}),
			// ),
			responses: createResponses({
				200: z.object({
					user: UserSchema,
				}),
			}),
		},
	},
	{ pathPrefix: '/admins' },
);
