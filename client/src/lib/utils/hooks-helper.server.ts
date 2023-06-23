import type { GetUserFromSessionQuery } from '$/graphql/@generated';
import type { createClient } from '$lib/urql';
import { gql } from '@urql/svelte';

export async function getUser(client: ReturnType<typeof createClient>) {
	const result = await client
		.query(
			gql<GetUserFromSessionQuery>`
				query GetUserFromSession {
					getUser {
						email
						firstName
						lastName
					}
				}
			`,
			{},
		)
		.toPromise();

	if (!result.data) {
		return null;
	}

	return {
		email: result.data.getUser.email,
		firstName: result.data.getUser.firstName,
		lastName: result.data.getUser.lastName,
	};
}

export type ClientUser = Awaited<ReturnType<typeof getUser>>;
