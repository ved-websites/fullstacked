import { createToasts } from '$lib/components/ToastManager/helper';
import { assertTsRestActionResultOK, assertTsRestResultOK } from '$lib/utils/assertions';
import { createPageDataObject } from '$lib/utils/page-data-object';
import { fail } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { redirect } from 'sveltekit-flash-message/server';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { k } from '~shared';
import { adminNewUserFormSchema } from '../schema/schema';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals: { tsrest } }) => {
	const result = await tsrest.roles.list();

	assertTsRestResultOK(result);

	const form = await superValidate(zod(adminNewUserFormSchema));

	return {
		form,
		roles: result.body,
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const {
			request,
			locals: { tsrest },
		} = event;

		const form = await superValidate(request, zod(adminNewUserFormSchema));

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
				throw redirect(
					'/admin/users',
					{
						toasts: createToasts({
							text: k('admin.users.actions.create.success'),
							i18nPayload: { email: form.data.email },
						}),
					},
					event,
				);
			},
		});
	},
} satisfies Actions;
