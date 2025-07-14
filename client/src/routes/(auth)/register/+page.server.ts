import { assertTsRestActionResultOK, assertTsRestResultOK } from '$lib/utils/assertions';
import { error, type Actions } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { registerSchema } from './schema';

export const load = (async ({ url, locals: { tsrest } }) => {
	const registerToken = url.searchParams.get('token');

	if (!registerToken) {
		error(StatusCodes.BAD_REQUEST, { message: '(auth).register.errors.missing-token' satisfies I18nKey });
	}

	const result = await tsrest.auth.initRegistration({ query: { registerToken } });

	assertTsRestResultOK(result);

	const { email, ...attributes } = result.body;

	const form = await superValidate({ registerToken, ...attributes }, zod4(registerSchema));

	return {
		form,
		userEmail: email,
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const {
			request,
			locals: { tsrest },
		} = event;

		const form = await superValidate(request, zod4(registerSchema));

		const { registerToken, password, ...user } = form.data;

		return assertTsRestActionResultOK({
			form,
			event,
			result: () => tsrest.auth.register({ body: { registerToken, password, user } }),
			onValid: () => ({ redirectTo: '/' }),
		});
	},
} satisfies Actions;
