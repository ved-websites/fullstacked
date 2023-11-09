import { DeleteUserProfilePictureStore, EditProfileBasicInfoStore, EditUserProfilePictureStore } from '$houdini';
import { createToasts } from '$lib/components/ToastManager/helper';
import { userFormSchema } from '$lib/components/UserForm/userform.schema';
import { fail, type Actions } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals: { sessionUser } }) => {
	const form = await superValidate(sessionUser, userFormSchema);

	return { form };
}) satisfies PageServerLoad;

export const actions = {
	basicUserInfo: async ({
		request,
		locals: {
			gql: { mutate },
		},
	}) => {
		const form = await superValidate(request, userFormSchema);

		if (!form.valid) return { form };

		const { firstName, lastName } = form.data;

		const result = await mutate(EditProfileBasicInfoStore, {
			firstName,
			lastName,
		});

		if (result.type === 'failure') {
			return result.kitHandler('error');
		}

		return { form };
	},
	profilePicture: async ({
		request,
		locals: {
			gql: { mutate },
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

		return {};
	},
	deleteProfilePicture: async ({
		locals: {
			gql: { mutate },
		},
	}) => {
		const result = await mutate(DeleteUserProfilePictureStore, null);

		if (result.type === 'failure') {
			return result.kitHandler('error');
		}

		return {};
	},
} satisfies Actions;
