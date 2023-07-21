import type { LoginMutation, LoginMutationVariables } from '$/graphql/@generated';
import type { ToastManagerData } from '$/lib/components/ToastManager/helper';
import { emailSchema, passwordSchema } from '$/lib/schemas/auth';
import { withJsParam } from '$/lib/utils/js-handling';
import { createLayoutAlert } from '$/lib/utils/layout-alert';
import { fail, redirect } from '@sveltejs/kit';
import { gql } from '@urql/svelte';
import { StatusCodes } from 'http-status-codes';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
	email: emailSchema,
	password: passwordSchema,
});

export const load = (async ({ url }) => {
	const form = await superValidate(schema);

	const redirectTo = url.searchParams.has('redirectTo') || undefined;

	const layoutAlert =
		redirectTo &&
		createLayoutAlert({
			text: `Vous devez être connecté pour accéder à cette ressource!`,
			level: 'warning',
		});

	return { form, layoutAlert };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, url, locals: { urql } }) => {
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
			const invalidUserPassErrorCatcher = 'Invalid';

			const allErrors: ToastManagerData[] =
				error?.graphQLErrors
					.filter((gqlError) => !gqlError.message.includes(invalidUserPassErrorCatcher))
					.map((gqlError) => ({
						text: gqlError.message,
						type: 'error',
					})) ?? [];

			const gqlUserPassError = error && error.graphQLErrors.find((gqlError) => gqlError.message.includes(invalidUserPassErrorCatcher));

			const userPassError =
				gqlUserPassError &&
				createLayoutAlert({
					text: gqlUserPassError.message,
					level: 'error',
				});

			return fail(StatusCodes.UNAUTHORIZED, { form, allErrors, layoutAlert: userPassError });
		}

		const userHasJs = url.searchParams.has(withJsParam);

		const redirectToParam = url.searchParams.get('redirectTo');

		let accessTokenSearchParam = '';

		if (userHasJs) {
			accessTokenSearchParam = redirectToParam
				? `${redirectToParam.includes('?') ? '&' : '?'}accessToken=${data.login.accessToken}`
				: `?accessToken=${data.login.accessToken}`;
		}

		const redirectTo = redirectToParam ? `/${redirectToParam.slice(1)}` : `/`;

		// Successful login
		throw redirect(StatusCodes.SEE_OTHER, `${redirectTo}${accessTokenSearchParam}`);
	},
} satisfies Actions;
