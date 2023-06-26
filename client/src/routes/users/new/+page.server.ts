import type { CreateNewUserMutation, CreateNewUserMutationVariables, GetRolesQuery, GetRolesQueryVariables } from '$/graphql/@generated';
import { simpleQuery } from '$/lib/utils/auth';
import { redirect } from '@sveltejs/kit';
import { gql } from '@urql/svelte';
import { StatusCodes } from 'http-status-codes';
import { message, superValidate } from 'sveltekit-superforms/server';
import { userFormSchema } from '../components/userform.schema';
import type { Actions, PageServerLoad } from './$types';

export const load = (async (event) => {
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

	const form = await superValidate(userFormSchema);

	return {
		form,
		roles: rolesQuery.getRoles,
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, locals: { client } }) => {
		const form = await superValidate(request, userFormSchema);

		if (!form.valid) return { form };

		const { email, firstName, lastName, roles } = form.data;

		const { data, error } = await client
			.mutation(
				gql<CreateNewUserMutation, CreateNewUserMutationVariables>`
					mutation CreateNewUser($email: String!, $firstName: String, $lastName: String, $roles: RoleCreateNestedManyWithoutUsersInput) {
						createUser(data: { email: $email, firstName: $firstName, lastName: $lastName, roles: $roles }) {
							email
							firstName
						}
					}
				`,
				{
					email,
					firstName,
					lastName,
					roles: {
						connect: roles.map((role) => ({
							text: role.name,
						})),
					},
				},
			)
			.toPromise();

		if (error || !data) {
			return message(form, error?.graphQLErrors.at(0)?.message);
		}

		throw redirect(StatusCodes.SEE_OTHER, '/users');
	},
} satisfies Actions;
