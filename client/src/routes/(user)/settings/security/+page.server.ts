import { createToasts } from '$lib/components/ToastManager/helper';
import { assertTsRestActionResultOK } from '$lib/utils/assertions';
import { createPageDataObject } from '$lib/utils/page-data-object';
import type { Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import { k, passwordSchema } from '~shared';
import type { PageServerLoad } from './$types';

const newPasswordFormSchema = z
	.object({
		password: passwordSchema,
		confirm: z.string(),
	})
	.refine(({ password, confirm }) => password === confirm, {
		message: k('settings.security.actions.password.errors.not-matching'),
		path: ['confirm'],
	});

export const load = (async () => {
	const form = await superValidate(newPasswordFormSchema);

	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const {
			request,
			locals: { tsrest },
		} = event;

		const form = await superValidate(request, newPasswordFormSchema);

		return assertTsRestActionResultOK({
			form,
			event,
			result: () => tsrest.user.settings.security.changePassword({ body: form.data }),
			onValid: () => {
				const toasts = createToasts({
					text: k('settings.security.actions.password.updated.success'),
				});

				return createPageDataObject({ form, toasts });
			},
		});
	},
} satisfies Actions;
