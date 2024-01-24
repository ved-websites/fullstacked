import { createToasts } from '$lib/components/ToastManager/helper';
import { assertTsRestActionResultOK, assertTsRestResultOK } from '$lib/utils/assertions';
import { redirect } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms/server';
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

	const form = await superValidate(formattedEditableUser, adminUserFormSchema);

	return {
		editableUser: formattedEditableUser,
		form,
		roles,
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const {
			request,
			locals: { tsrest },
			params: { email: editableUserEmail },
		} = event;

		const form = await superValidate(request, adminUserFormSchema);

		return assertTsRestActionResultOK({
			form,
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
			onValid: () => {
				throw redirect(
					'/admin/users',
					{
						toasts: createToasts({
							text: `Successfully created edited user ${editableUserEmail}!`, // TODO : i18n
						}),
					},
					event,
				);
			},
		});
	},
} satisfies Actions;
