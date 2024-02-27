import { createToasts } from '$lib/components/ToastManager/helper';
import { assertTsRestActionResultOK, assertTsRestResultOK } from '$lib/utils/assertions';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { k } from '~shared';
import { adminUserFormSchema } from '../schema/schema';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ params: { email }, locals: { tsrest } }) => {
	const result = await tsrest.users.admin.getUserForEdit({ query: { email } });

	assertTsRestResultOK(result);

	const { user, roles } = result.body;

	const formattedEditableUser = user as unknown as (Omit<typeof user, 'roles'> & { roles: string[] }) | null | undefined;

	if (formattedEditableUser) {
		formattedEditableUser.roles = user.roles.map((role) => role.text);
	}

	const form = await superValidate(formattedEditableUser, zod(adminUserFormSchema));

	return {
		editableUser: formattedEditableUser,
		form,
		roles,
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, locals: { tsrest }, params: { email: editableUserEmail }, cookies }) => {
		const form = await superValidate(request, zod(adminUserFormSchema));

		return assertTsRestActionResultOK({
			form,
			cookies,
			result: () => {
				return tsrest.users.admin.editUser({
					body: {
						userRef: editableUserEmail,
						firstName: form.data.firstName,
						lastName: form.data.lastName,
						roles: {
							set: form.data.roles.map((r) => ({ text: r })),
						},
					},
				});
			},
			onValid: () => ({
				redirectTo: '/admin/users',
				toasts: createToasts({
					text: k('admin.users.actions.edit.success'),
					i18nPayload: { email: editableUserEmail },
				}),
			}),
		});
	},
} satisfies Actions;
