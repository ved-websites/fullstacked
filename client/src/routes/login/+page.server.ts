import type { LoginMutation, LoginMutationVariables } from '$/graphql/@generated';
import { emailSchema, passwordSchema } from '$/lib/schemas/auth';
import { redirect } from '@sveltejs/kit';
import { gql } from '@urql/svelte';
import { StatusCodes } from 'http-status-codes';
import { message, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
	email: emailSchema,
	password: passwordSchema,
});

export const load = (async () => {
	const form = await superValidate(schema);

	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, url, locals: { urql, userHasJS } }) => {
		const form = await superValidate(request, schema);

		if (!form.valid) return { form };

		const { email, password } = form.data;

		const { data, error } = await urql
			.mutation(
				gql<LoginMutation, LoginMutationVariables>`
					mutation Login($email: String!, $password: String!) {
						login(data: { email: $email, password: $password }) {
							accessToken
						}
					}
				`,
				{ email, password },
			)
			.toPromise();

		if (error || !data) {
			return message(form, error?.message);
		}

		const redirectToParam = url.searchParams.get('redirectTo');

		let accessTokenSearchParam = '';

		if (userHasJS) {
			accessTokenSearchParam = redirectToParam
				? `${redirectToParam.includes('?') ? '&' : '?'}accessToken=${data.login.accessToken}`
				: `?accessToken=${data.login.accessToken}`;
		}

		const redirectTo = redirectToParam ? `/${redirectToParam.slice(1)}` : `/`;

		// Successful login
		throw redirect(StatusCodes.SEE_OTHER, `${redirectTo}${accessTokenSearchParam}`);
	},
} satisfies Actions;
