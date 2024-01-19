import { firstNameSchema, lastNameSchema } from '$lib/schemas/auth';
import { assertTsRestActionResultOK, assertTsRestResultOK } from '$lib/utils/assertions';
import { error, redirect, type Actions } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import { passwordSchema } from '~shared';
import type { PageServerLoad } from './$types';

const schema = z.object({
	registerToken: z.string(),
	firstName: firstNameSchema,
	lastName: lastNameSchema,
	password: passwordSchema,
});

export const load = (async ({ url, locals: { tsrest } }) => {
	const registerToken = url.searchParams.get('token');

	if (!registerToken) {
		throw error(StatusCodes.BAD_REQUEST, { message: 'Missing register token!' });
	}

	const result = await tsrest.auth.initRegistration({ query: { registerToken } });

	assertTsRestResultOK(result, (result) => [result.status, result.body.message]);

	const { email, ...attributes } = result.body;

	const form = await superValidate({ registerToken, ...attributes }, schema);

	return {
		form,
		userEmail: email,
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, locals: { tsrest } }) => {
		const form = await superValidate(request, schema);

		const { registerToken, password, ...user } = form.data;

		return assertTsRestActionResultOK({
			form,
			result: () => tsrest.auth.register({ body: { registerToken, password, user } }),
			onValid: () => {
				throw redirect(StatusCodes.SEE_OTHER, '/');
			},
		});
	},
} satisfies Actions;
