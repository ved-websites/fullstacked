import type { DeleteSpecificUserMutation, DeleteSpecificUserMutationVariables, ManageGetUsersQuery } from '$/graphql/@generated';
import { emailSchema } from '$/lib/schemas/auth';
import { redirect } from '@sveltejs/kit';
import { gql } from '@urql/svelte';
import { StatusCodes } from 'http-status-codes';
import type { Actions } from '../$types';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals: { client } }) => {
	const usersQuery = await client.query(
		gql<ManageGetUsersQuery>`
			query ManageGetUsers {
				getUsers {
					email
					firstName
					lastName
					roles {
						text
					}
				}
			}
		`,
		{},
	);

	const { data, error } = usersQuery;

	if (error || !data) {
		throw redirect(StatusCodes.SEE_OTHER, `/`);
	}

	return {
		users: data.getUsers,
	};
}) satisfies PageServerLoad;

export const actions = {
	delete: async ({ request, locals: { client } }) => {
		const formdata = await request.formData();

		const email = await emailSchema.parseAsync(formdata.get('email')).catch(() => {
			throw redirect(StatusCodes.SEE_OTHER, '/users?error=Missing email!');
		});

		const { data, error } = await client
			.mutation(
				gql<DeleteSpecificUserMutation, DeleteSpecificUserMutationVariables>`
					mutation DeleteSpecificUser($email: String!) {
						deleteUser(where: { email: $email }) {
							email
							firstName
						}
					}
				`,
				{ email },
			)
			.toPromise();

		if (error || !data) {
			throw redirect(StatusCodes.SEE_OTHER, '/users?error');
		}

		throw redirect(StatusCodes.SEE_OTHER, '/users?ok');
	},
} satisfies Actions;
