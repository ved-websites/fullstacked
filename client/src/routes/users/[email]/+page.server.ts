import { createToasts } from '$/lib/components/ToastManager/helper';
import { DeleteUserProfilePictureStore, EditOtherUserInfoStore, EditUserProfilePictureStore, GetEditableUserStore } from '$houdini';
import { fail, redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { superValidate } from 'sveltekit-superforms/server';
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
	user: async ({
		request,
		locals: {
			gql: { mutate },
		},
		params: { email: editableUserEmail },
	}) => {
		const form = await superValidate(request, userFormSchema);

		if (!form.valid) return { form };

		const { email, firstName, lastName, roles } = form.data;

		const result = await mutate(EditOtherUserInfoStore, {
			oldEmail: editableUserEmail,
			email,
			firstName,
			lastName,
			roles: roles.map((role) => ({
				text: role,
			})),
		});

		if (result.type === 'failure') {
			return result.kitHandler('error');
		}

		throw redirect(StatusCodes.SEE_OTHER, '/users');
	},
	profilePicture: async ({
		request,
		locals: {
			gql: { mutate },
			sessionUser,
		},
	}) => {
		const formData = await request.formData();

		const profilePictureFile = formData.get('profile-picture');

		if (!(profilePictureFile instanceof File)) {
			const toasts = createToasts([
				{
					text: 'Missing profile picture file!',
				},
			]);

			return fail(StatusCodes.BAD_REQUEST, { toasts });
		}

		const result = await mutate(EditUserProfilePictureStore, {
			profilePicture: profilePictureFile,
		});

		if (result.type === 'failure') {
			return result.kitHandler('error');
		}

		throw redirect(StatusCodes.SEE_OTHER, `/users/${sessionUser!.email}`);
	},
	deleteProfilePicture: async ({
		locals: {
			gql: { mutate },
			sessionUser,
		},
	}) => {
		const result = await mutate(DeleteUserProfilePictureStore, null);

		if (result.type === 'failure') {
			return result.kitHandler('error');
		}

		throw redirect(StatusCodes.SEE_OTHER, `/users/${sessionUser!.email}`);
	},
} satisfies Actions;
