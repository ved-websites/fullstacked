import type UserCreateInputSchema from '$zod/inputTypeSchemas/UserCreateInputSchema';
import type UserUpdateInputSchema from '$zod/inputTypeSchemas/UserUpdateInputSchema';
import type UserFindManyArgsSchema from '$zod/outputTypeSchemas/UserFindManyArgsSchema';
import { z } from 'zod';
import { c, createResponses } from '~contract';
import { LiveUserSchema, UserRolesSchemaExtension, UserSchema, emailSchema } from '~shared';

export type AdminListUsersGql = z.infer<typeof UserFindManyArgsSchema> & { select?: { online?: boolean } };

export type UserCreateInputNoId = Omit<z.output<typeof UserCreateInputSchema>, 'id'>;

export const adminContract = c.router(
	{
		listUsers: {
			method: 'GET',
			path: '/users',
			summary: 'Get a list of all users for administrative usage.',
			responses: createResponses({
				200: z.array(LiveUserSchema.extend(UserRolesSchemaExtension)),
			}),
		},
		getUserForEdit: {
			method: 'GET',
			path: '/user/edit',
			summary: 'Get user to edit as admin.',
			query: z.object({
				email: emailSchema,
			}),
			responses: createResponses({
				200: z.object({
					user: UserSchema.extend(UserRolesSchemaExtension),
					roles: UserRolesSchemaExtension.roles,
				}),
			}),
		},
		editUser: {
			method: 'POST',
			path: '/user/edit',
			summary: 'Edits a user as admin.',
			body: c.type<
				Pick<z.output<typeof UserUpdateInputSchema>, 'firstName' | 'lastName' | 'roles'> & {
					userRef: z.output<typeof emailSchema>;
				}
			>(),
			responses: createResponses({
				200: z.object({
					user: UserSchema,
				}),
			}),
		},
		createUser: {
			method: 'POST',
			path: '/user/new',
			summary: 'Create a user as admin.',
			body: c.type<UserCreateInputNoId>(),
			responses: createResponses({
				200: z.undefined(),
			}),
		},
		deleteUser: {
			method: 'DELETE',
			path: '/user',
			summary: 'Delete a user as admin.',
			body: z.object({
				email: emailSchema,
			}),
			responses: createResponses({
				200: z.undefined(),
			}),
		},
		resendInviteLink: {
			method: 'POST',
			path: '/user/resend-invite-link',
			summary: 'Resend the email to allow the user to register.',
			body: z.object({
				email: emailSchema,
			}),
			responses: createResponses({
				200: z.boolean(),
			}),
		},
	},
	{ pathPrefix: '/admins' },
);
