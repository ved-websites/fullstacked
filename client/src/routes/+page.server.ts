import type { LogoutMutation } from '$/graphql/@generated';
import { themeCookieName, themes } from '$/lib/stores';
import { fail, redirect, type Actions } from '@sveltejs/kit';
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
	theme({ cookies, url: { searchParams } }) {
		const theme = searchParams.get('value');

		const redirectToParam = searchParams.get('redirectTo');
		const redirectTo = redirectToParam ? `/${redirectToParam.slice(1)}` : `/`;

		if (theme === 'null') {
			cookies.delete(themeCookieName);

			throw redirect(StatusCodes.SEE_OTHER, redirectTo);
		}

		if (!theme || !(themes as unknown as string[]).includes(theme)) {
			throw fail(StatusCodes.BAD_REQUEST);
		}

		cookies.set(themeCookieName, theme, {
			expires: new Date('01 Jan 9999'),
			httpOnly: false,
		});

		throw redirect(StatusCodes.SEE_OTHER, redirectTo);
	},
} satisfies Actions;
