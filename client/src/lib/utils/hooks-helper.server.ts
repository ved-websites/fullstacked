import type { GetUserFromSessionQuery } from '$/graphql/@generated';
import { Client, gql } from '@urql/svelte';

export async function getAuthUser(client: Client) {
	const result = await client
		.query(
			gql<GetUserFromSessionQuery>`
				query GetUserFromSession {
					getSessionUser {
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
		...result.data.getSessionUser,
	};
}

export type ClientUser = Awaited<ReturnType<typeof getAuthUser>>;
