import { createToasts } from '$lib/components/ToastManager/helper';
import type { PageMessages } from '$lib/types';
import { assertTsRestActionResultOK, assertTsRestResultOK } from '$lib/utils/assertions';
import { fail } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { I18nKey } from '~shared';
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
	default: async ({ request, locals: { tsrest }, cookies }) => {
		const form = await superValidate(request, zod(adminNewUserFormSchema));

		return assertTsRestActionResultOK({
			form,
			cookies,
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

				return fail(result.status, { ...pageData, form } satisfies PageMessages);
			},
			onValid: () => ({
				redirectTo: '/admin/users',
				toasts: createToasts({
					text: 'admin.users.actions.create.success' satisfies I18nKey,
					i18nPayload: { email: form.data.email },
				}),
			}),
		});
	},
} satisfies Actions;
