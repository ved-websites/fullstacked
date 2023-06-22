import type { LogoutMutation } from '$/graphql/@generated';
import { redirect, type Actions } from '@sveltejs/kit';
import { gql } from '@urql/svelte';
import { StatusCodes } from 'http-status-codes';

export const actions = {
	async logout(event) {
		const client = event.locals.getClient(event);

		const { data, error } = await client
			.mutation(
				gql<LogoutMutation>`
					mutation Logout {
						logout {
							loggedOut
						}
					}
				`,
				{},
			)
			.toPromise();

		if (error || !data) {
			return;
		}

		event.cookies.delete('session');

		throw redirect(StatusCodes.SEE_OTHER, '/login');
	},
} satisfies Actions;
