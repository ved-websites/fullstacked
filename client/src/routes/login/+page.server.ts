import type { LoginMutation, LoginMutationVariables } from '$/graphql/@generated';
import { redirect } from '@sveltejs/kit';
import { gql } from '@urql/svelte';
import { StatusCodes } from 'http-status-codes';
import { message, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

const PASSWORD_MIN_LENGTH = 4;

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} chars!`),
});

export const load = (async () => {
	const form = await superValidate(schema);

	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, url, locals: { client } }) => {
		const form = await superValidate(request, schema);

		if (!form.valid) return { form };

		const { email, password } = form.data;

		// Sending this on the server makes the cookies unhandled
		const { data, error } = await client
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

		const redirectTo = url.searchParams.get('redirectTo');

		if (redirectTo) {
			// Successful login, go to redirectedTo Page
			throw redirect(StatusCodes.SEE_OTHER, `/${redirectTo.slice(1)}`);
		}

		// Successful login, go to Home Page
		throw redirect(StatusCodes.SEE_OTHER, '/');
	},
} satisfies Actions;
