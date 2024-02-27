import { createToasts } from '$lib/components/ToastManager/helper';
import { userFormSchema } from '$lib/components/UserForm/userform.schema';
import { assertTsRestActionResultOK } from '$lib/utils/assertions';
import { fail, type Actions } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { I18nKey } from '~shared';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals: { sessionUser } }) => {
	const form = await superValidate(sessionUser, zod(userFormSchema));

	return { form };
}) satisfies PageServerLoad;

export const actions = {
	basicUserInfo: async ({ request, locals: { tsrest }, cookies }) => {
		const form = await superValidate(request, zod(userFormSchema));

		return assertTsRestActionResultOK({
			form,
			cookies,
			result: () => tsrest.user.settings.profile.update({ body: form.data }),
		});
	},
	profilePicture: async ({ request, locals: { tsrest }, cookies }) => {
		const formData = await request.formData();

		const profilePictureFile = formData.get('profile-picture');

		if (!(profilePictureFile instanceof File)) {
			const toasts = createToasts({
				text: 'settings.profile.picture.errors.missing' satisfies I18nKey,
			});

			return fail(StatusCodes.BAD_REQUEST, { toasts });
		}

		return assertTsRestActionResultOK({
			cookies,
			result: () => tsrest.user.settings.profile.uploadPicture({ body: formData }),
		});
	},
	deleteProfilePicture: async ({ locals: { tsrest }, cookies }) => {
		return assertTsRestActionResultOK({
			cookies,
			result: () => tsrest.user.settings.profile.deletePicture(),
		});
	},
} satisfies Actions;
