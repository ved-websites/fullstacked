import type {
	GetUnregisteredUserQuery,
	GetUnregisteredUserQueryVariables,
	RegisterNewUserMutation,
	RegisterNewUserMutationVariables,
} from '$/graphql/@generated';
import { firstNameSchema, lastNameSchema, passwordSchema } from '$/lib/schemas/auth';
import { simpleQuery } from '$/lib/utils/auth';
import { error, redirect, type Actions } from '@sveltejs/kit';
import { gql } from '@urql/svelte';
import { StatusCodes } from 'http-status-codes';
import { message, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

const schema = z.object({
	registerToken: z.string(),
	firstName: firstNameSchema,
	lastName: lastNameSchema,
	password: passwordSchema,
});

export const load = (async (event) => {
	const registerToken = event.url.searchParams.get('token');

	if (!registerToken) {
		throw error(StatusCodes.BAD_REQUEST, { message: 'Missing register token!' });
	}

	const unregisteredUserQuery = await simpleQuery<GetUnregisteredUserQuery, GetUnregisteredUserQueryVariables>(
		event,
		gql`
			query GetUnregisteredUser($registerToken: String!) {
				getUnregisteredUser(registerToken: $registerToken) {
					email
					firstName
					lastName
				}
			}
		`,
		{
			registerToken,
		},
	);

	const {
		getUnregisteredUser: { email, ...attributes },
	} = unregisteredUserQuery;

	const form = await superValidate({ registerToken, ...attributes }, schema);

	return {
		form,
		userEmail: email,
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, locals: { client } }) => {
		const form = await superValidate(request, schema);

		if (!form.valid) return { form };

		const { data, error } = await client
			.mutation(
				gql<RegisterNewUserMutation, RegisterNewUserMutationVariables>`
					mutation RegisterNewUser($data: RegisterInput!) {
						register(data: $data) {
							user {
								email
							}
						}
					}
				`,
				{
					data: {
						...form.data,
					},
				},
			)
			.toPromise();

		if (error || !data) {
			return message(form, error?.message);
		}

		throw redirect(StatusCodes.SEE_OTHER, '/');
	},
} satisfies Actions;
