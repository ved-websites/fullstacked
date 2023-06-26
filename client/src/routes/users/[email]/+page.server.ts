import type {
	EditOtherUserInfoMutation,
	EditOtherUserInfoMutationVariables,
	GetEditableUserQuery,
	GetEditableUserQueryVariables,
	GetRolesQuery,
	GetRolesQueryVariables,
} from '$/graphql/@generated';
import { simpleQuery } from '$/lib/utils/auth';
import { redirect } from '@sveltejs/kit';
import { gql } from '@urql/svelte';
import { StatusCodes } from 'http-status-codes';
import { message, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
	email: z.string().email(),
	firstName: z.nullable(z.string()),
	lastName: z.nullable(z.string()),
	roles: z.array(z.object({ value: z.string(), name: z.string() })),
});

export const load = (async (event) => {
	const { email } = event.params;

	const editableUserQuery = await simpleQuery<GetEditableUserQuery, GetEditableUserQueryVariables>(
		event,
		gql`
			query GetEditableUser($email: String!) {
				getUser(where: { email: { equals: $email } }) {
					email
					firstName
					lastName
					roles {
						value: id
						name: text
					}
				}
			}
		`,
		{
			email,
		},
	);

	const rolesQuery = await simpleQuery<GetRolesQuery, GetRolesQueryVariables>(
		event,
		gql`
			query GetRoles {
				getRoles {
					id
					text
				}
			}
		`,
		{},
	);

	const { getUser: editableUser } = editableUserQuery;

	const form = await superValidate(editableUser, schema);

	return {
		editableUser,
		form,
		roles: rolesQuery.getRoles,
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, locals: { client }, params: { email: editableUserEmail } }) => {
		const form = await superValidate(request, schema);

		if (!form.valid) return { form };

		const { email, firstName, lastName, roles } = form.data;

		const { data, error } = await client
			.mutation(
				gql<EditOtherUserInfoMutation, EditOtherUserInfoMutationVariables>`
					mutation EditOtherUserInfo(
						$oldEmail: String!
						$email: String!
						$firstName: String
						$lastName: String
						$roles: [RoleWhereUniqueInput!]
					) {
						editUser(
							where: { email: $oldEmail }
							data: { email: { set: $email }, firstName: { set: $firstName }, lastName: { set: $lastName }, roles: { set: $roles } }
						) {
							email
							firstName
						}
					}
				`,
				{
					oldEmail: editableUserEmail,
					email,
					firstName,
					lastName,
					roles: roles.map((role) => ({
						text: role.name,
					})),
				},
			)
			.toPromise();

		if (error || !data) {
			return message(form, error?.graphQLErrors.at(0)?.message);
		}

		throw redirect(StatusCodes.SEE_OTHER, '/users');
	},
} satisfies Actions;
