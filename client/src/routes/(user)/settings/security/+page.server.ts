import { createToasts } from '$lib/components/ToastManager/helper';
import { assertTsRestActionResultOK } from '$lib/utils/assertions';
import { createPageDataObject } from '$lib/utils/page-data-object';
import type { Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import { passwordSchema } from '~shared';
import type { PageServerLoad } from './$types';

const newPasswordFormSchema = z
	.object({
		password: passwordSchema,
		confirm: z.string(),
	})
	.refine(({ password, confirm }) => password === confirm, {
		message: 'Passwords do not match!',
		path: ['confirm'],
	});

export const load = (async () => {
	const form = await superValidate(newPasswordFormSchema);

	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, locals: { tsrest } }) => {
		const form = await superValidate(request, newPasswordFormSchema);

		return assertTsRestActionResultOK({
			form,
			result: () => tsrest.user.settings.security.changePassword({ body: form.data }),
			onValid: () => {
				const toasts = createToasts([
					{
						text: 'Successfully updated password!', // TODO : i18n
					},
				]);

				return createPageDataObject({ form, toasts });
			},
		});
	},
} satisfies Actions;
