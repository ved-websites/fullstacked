import { assertTsRestActionResultOK, assertTsRestResultOK } from '$lib/utils/assertions';
import { error, redirect, type Actions } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { registerSchema } from './schema';

export const load = (async ({ url, locals: { tsrest } }) => {
	const registerToken = url.searchParams.get('token');

	if (!registerToken) {
		error(StatusCodes.BAD_REQUEST, { message: 'Missing register token!' });
	}

	const result = await tsrest.auth.initRegistration({ query: { registerToken } });

	assertTsRestResultOK(result, (result) => [result.status, result.body.message]);

	const { email, ...attributes } = result.body;

	const form = await superValidate({ registerToken, ...attributes }, registerSchema);

	return {
		form,
		userEmail: email,
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, locals: { tsrest } }) => {
		const form = await superValidate(request, registerSchema);

		const { registerToken, password, ...user } = form.data;

		return assertTsRestActionResultOK({
			form,
			result: () => tsrest.auth.register({ body: { registerToken, password, user } }),
			onValid: () => {
				redirect(StatusCodes.SEE_OTHER, '/');
			},
		});
	},
} satisfies Actions;
