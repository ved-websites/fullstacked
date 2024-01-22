import { assertTsRestActionResultOK, assertTsRestResultOK } from '$lib/utils/assertions';
import { createPageDataObject } from '$lib/utils/page-data-object';
import { fail, redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { adminNewUserFormSchema } from '../schema/schema';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals: { tsrest } }) => {
	const result = await tsrest.roles.list();

	assertTsRestResultOK(result);

	const form = await superValidate(adminNewUserFormSchema);

	return {
		form,
		roles: result.body,
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, locals: { tsrest } }) => {
		const form = await superValidate(request, adminNewUserFormSchema);

		return assertTsRestActionResultOK({
			form,
			result: () => {
				const { email, firstName, lastName, roles, emailLang } = form.data;

				return tsrest.users.admin.createUser({
					body: {
						email,
						firstName,
						lastName,
						roles: {
							connect: roles.map((role) => ({
								text: role,
							})),
						},
						emailLang,
					},
				});
			},
			onNotOk: (result, { errorMessage, pageData }) => {
				if (result.status == StatusCodes.BAD_REQUEST) {
					setError(form, 'email', errorMessage);
				} else {
					setError(form, errorMessage);
				}

				return fail(result.status, createPageDataObject({ ...pageData, form }));
			},
			onValid: () => {
				throw redirect(StatusCodes.SEE_OTHER, '/admin/users');
			},
		});
	},
} satisfies Actions;
