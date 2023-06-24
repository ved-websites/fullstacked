import type { ManageGetUsersQuery } from '$/graphql/@generated';
import { redirect } from '@sveltejs/kit';
import { gql } from '@urql/svelte';
import { StatusCodes } from 'http-status-codes';
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
