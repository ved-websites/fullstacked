import { createToasts } from '$lib/components/ToastManager/helper';
import { assertTsRestActionResultOK } from '$lib/utils/assertions';
import type { Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { passwordSchema, type I18nKey } from '~shared';
import type { PageServerLoad } from './$types';

const newPasswordFormSchema = z
	.object({
		password: passwordSchema,
		confirm: z.string(),
	})
	.refine(({ password, confirm }) => password === confirm, {
		message: 'settings.security.actions.password.errors.not-matching' satisfies I18nKey,
		path: ['confirm'],
	});

export const load = (async () => {
	const form = await superValidate(zod(newPasswordFormSchema));

	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const {
			request,
			locals: { tsrest },
		} = event;

		const form = await superValidate(request, zod(newPasswordFormSchema));

		return assertTsRestActionResultOK({
			form,
			event,
			result: () => tsrest.user.settings.security.changePassword({ body: form.data }),
			onValid: () => ({
				form,
				toasts: createToasts({
					text: 'settings.security.actions.password.updated.success' satisfies I18nKey,
				}),
			}),
		});
	},
} satisfies Actions;
