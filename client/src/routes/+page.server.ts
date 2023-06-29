import type { LogoutMutation } from '$/graphql/@generated';
import { redirect, type Actions } from '@sveltejs/kit';
import { gql } from '@urql/svelte';
import { StatusCodes } from 'http-status-codes';

export const actions = {
	async logout({ locals: { urql } }) {
		const { data, error } = await urql
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

		throw redirect(StatusCodes.SEE_OTHER, '/login');
	},
} satisfies Actions;
