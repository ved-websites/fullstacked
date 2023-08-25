import {
	EditOtherUserInfoStore,
	EditOtherUserInfoWithAvatarStore,
	GetEditableUserStore,
	type EditOtherUserInfo$input,
	type EditOtherUserInfoWithAvatar$input,
} from '$houdini';
import { redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { userFormSchema } from '../components/userform.schema';
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

	const form = await superValidate(formattedEditableUser, userFormSchema);

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
		const formData = await request.formData();
		const form = await superValidate(formData, userFormSchema);

		if (!form.valid) return { form };

		const { email, firstName, lastName, roles } = form.data;
		const avatarFile = formData.get('avatar');

		const [EditUserStore, variables] = (():
			| [typeof EditOtherUserInfoStore, EditOtherUserInfo$input]
			| [typeof EditOtherUserInfoWithAvatarStore, EditOtherUserInfoWithAvatar$input] => {
			const variables = {
				oldEmail: editableUserEmail,
				email,
				firstName,
				lastName,
				roles: roles.map((role) => ({
					text: role,
				})),
			};

			if (avatarFile instanceof File && avatarFile.size > 0) {
				(variables as EditOtherUserInfoWithAvatar$input).avatar = avatarFile;

				return [EditOtherUserInfoWithAvatarStore, variables];
			}

			return [EditOtherUserInfoStore, variables];
		})();

		const result = await mutate(EditUserStore, variables);

		if (result.type === 'failure') {
			return result.kitHandler('custom', ({ errors }) => {
				return setError(form, 'avatarFile', errors?.at(0)?.message ?? 'Unknown error');
			});
		}

		throw redirect(StatusCodes.SEE_OTHER, '/users');
	},
} satisfies Actions;
