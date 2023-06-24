import type { GetUserFromSessionQuery } from '$/graphql/@generated';
import { Client, gql } from '@urql/svelte';

export async function getUser(client: Client) {
	const result = await client
		.query(
			gql<GetUserFromSessionQuery>`
				query GetUserFromSession {
					getUser {
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
		)
		.toPromise();

	if (!result.data) {
		return null;
	}

	return {
		...result.data.getUser,
	};
}

export type ClientUser = Awaited<ReturnType<typeof getUser>>;
