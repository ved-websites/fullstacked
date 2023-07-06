import type { CreateNewUserMutation, CreateNewUserMutationVariables, GetRolesQuery, GetRolesQueryVariables } from '$/graphql/@generated';
import { simpleQuery } from '$/lib/utils/auth';
import { sendEmail } from '$/lib/utils/email';
import { PUBLIC_EMAILS_FROM } from '$env/static/public';
import { redirect } from '@sveltejs/kit';
import { gql } from '@urql/svelte';
import { StatusCodes } from 'http-status-codes';
import { message, superValidate } from 'sveltekit-superforms/server';
import { userFormSchema } from '../components/userform.schema';
import type { Actions, PageServerLoad } from './$types';
import RegisterEmail from './RegisterEmail.svelte';

export const load = (async (event) => {
	const rolesQuery = await simpleQuery<GetRolesQuery, GetRolesQueryVariables>(
		event,
		gql`
			query GetRoles {
				getRoles {
					id
					text
				}
			}
		`,
		{},
	);

	const form = await superValidate(userFormSchema);

	return {
		form,
		roles: rolesQuery.getRoles,
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, fetch, url, locals: { urql, sessionUser } }) => {
		const form = await superValidate(request, userFormSchema);

		if (!form.valid) return { form };

		const { email, firstName, lastName, roles } = form.data;

		const { data, error } = await urql
			.mutation(
				gql<CreateNewUserMutation, CreateNewUserMutationVariables>`
					mutation CreateNewUser($email: String!, $firstName: String, $lastName: String, $roles: RoleCreateNestedManyWithoutUsersInput) {
						createUser(data: { email: $email, firstName: $firstName, lastName: $lastName, roles: $roles }) {
							email
							firstName
							lastName
							registerToken
						}
					}
				`,
				{
					email,
					firstName,
					lastName,
					roles: {
						connect: roles.map((role) => ({
							text: role,
						})),
					},
				},
			)
			.toPromise();

		if (error || !data) {
			return message(form, error?.graphQLErrors.at(0)?.message);
		}

		// TODO: Send email to new user with proper link
		const fullname =
			data.createUser.firstName && data.createUser.lastName ? `${data.createUser.firstName} ${data.createUser.lastName}` : undefined;

		sendEmail(
			fetch,
			{
				template: RegisterEmail,
				props: {
					email: data.createUser.email,
					name: fullname,
					url: `${url.origin}/register?token=${data.createUser.registerToken}`,
				},
			},
			{
				to: { email: data.createUser.email, name: fullname },
				from: PUBLIC_EMAILS_FROM,
				subject: 'You have been invited to join the Fullstacked website!',
				replyTo: sessionUser?.email,
			},
		);

		throw redirect(StatusCodes.SEE_OTHER, '/users');
	},
} satisfies Actions;
