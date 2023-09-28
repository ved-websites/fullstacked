import { EditOtherUserInfoStore, GetEditableUserStore } from '$houdini';
import { redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { superValidate } from 'sveltekit-superforms/server';
import { adminUserFormSchema } from '../schema/schema';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({
	params: { email },
	locals: {
		gql: { query },
	},
}) => {
	const result = await query(GetEditableUserStore, {
		variables: {
			email,
		},
	});

	if (result.type === 'failure') {
		return result.kitHandler('redirect');
	}

	const { getUser: editableUser, getRoles } = result.data ?? {};

	const formattedEditableUser = editableUser as unknown as (Omit<typeof editableUser, 'roles'> & { roles: string[] }) | null | undefined;

	if (formattedEditableUser) {
		formattedEditableUser.roles = editableUser!.roles.map((role) => role.value);
	}

	const form = await superValidate(formattedEditableUser, adminUserFormSchema);

	return {
		editableUser,
		form,
		roles: getRoles ?? [],
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({
		request,
		locals: {
			gql: { mutate },
		},
		params: { email: editableUserEmail },
	}) => {
		const form = await superValidate(request, adminUserFormSchema);

		if (!form.valid) return { form };

		const { firstName, lastName, roles } = form.data;

		const result = await mutate(EditOtherUserInfoStore, {
			oldEmail: editableUserEmail,
			firstName,
			lastName,
			roles: roles.map((role) => ({
				text: role,
			})),
		});

		if (result.type === 'failure') {
			return result.kitHandler('failure', { data: { form } });
		}

		throw redirect(StatusCodes.SEE_OTHER, '/admin/users');
	},
} satisfies Actions;
