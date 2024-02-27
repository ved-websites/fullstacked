import { locales } from '$i18n-config';
import { createToasts } from '$lib/components/ToastManager/helper';
import { assertTsRestActionResultOK } from '$lib/utils/assertions';
import { superValidate } from 'sveltekit-superforms';
import { zod, type Infer } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { k } from '~shared';
import type { Actions, PageServerLoad } from './$types';

const langSchema = z.object({
	lang: z.nullable(z.string()),
});

export const load = (async ({ locals: { sessionUser, browserLang } }) => {
	const lang = sessionUser!.lang;

	const form = await superValidate<Infer<typeof langSchema>, string>({ lang }, zod(langSchema));

	return { form, browserLang };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, locals: { tsrest }, cookies }) => {
		const form = await superValidate(request, zod(langSchema));

		const lang = locales.includes(form.data.lang as string) ? form.data.lang : null;

		return assertTsRestActionResultOK({
			form,
			cookies,
			result: () => {
				return tsrest.user.settings.profile.update({
					body: { lang },
				});
			},
			onValid: () => ({
				toasts: createToasts({
					text: lang ? k('settings.experience.lang.toast.targetted') : k('settings.experience.lang.toast.automatic'),
					timeout: 3000,
				}),
			}),
		});
	},
} satisfies Actions;
