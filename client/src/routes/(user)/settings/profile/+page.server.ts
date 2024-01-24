import { createToasts } from '$lib/components/ToastManager/helper';
import { userFormSchema } from '$lib/components/UserForm/userform.schema';
import { assertTsRestActionResultOK } from '$lib/utils/assertions';
import { fail, type Actions } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals: { sessionUser } }) => {
	const form = await superValidate(sessionUser, userFormSchema);

	return { form };
}) satisfies PageServerLoad;

export const actions = {
	basicUserInfo: async ({ request, locals: { tsrest } }) => {
		const form = await superValidate(request, userFormSchema);

		return assertTsRestActionResultOK({
			form,
			result: () => tsrest.user.settings.profile.update({ body: form.data }),
			onValid: () => {
				return { form };
			},
		});
	},
	profilePicture: async ({ request, locals: { tsrest } }) => {
		const formData = await request.formData();

		const profilePictureFile = formData.get('profile-picture');

		if (!(profilePictureFile instanceof File)) {
			const toasts = createToasts([
				{
					text: 'Missing profile picture file!', // TODO : i18n
				},
			]);

			return fail(StatusCodes.BAD_REQUEST, { toasts });
		}

		return assertTsRestActionResultOK({
			result: () => tsrest.user.settings.profile.uploadPicture({ body: formData }),
			onValid: () => {
				return {};
			},
		});
	},
	deleteProfilePicture: async ({ locals: { tsrest } }) => {
		return assertTsRestActionResultOK({
			result: () => tsrest.user.settings.profile.deletePicture(),
			onValid: () => {
				return {};
			},
		});
	},
} satisfies Actions;
