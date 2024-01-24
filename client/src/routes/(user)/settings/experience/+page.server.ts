import { locales } from '$i18n-config';
import { createToasts } from '$lib/components/ToastManager/helper';
import { assertTsRestActionResultOK } from '$lib/utils/assertions';
import { createPageDataObject } from '$lib/utils/page-data-object';
import { redirect } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import { k } from '~shared';
import type { Actions, PageServerLoad } from './$types';

const langSchema = z.object({
	lang: z.nullable(z.string()),
});

export const load = (async ({ locals: { sessionUser, browserLang } }) => {
	const lang = sessionUser!.lang;

	const form = await superValidate<typeof langSchema, string>({ lang }, langSchema);

	return { form, browserLang };
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const {
			request,
			locals: { tsrest, userHasJs },
		} = event;

		const form = await superValidate(request, langSchema);

		const lang = locales.includes(form.data.lang as string) ? form.data.lang : null;

		return assertTsRestActionResultOK({
			form,
			result: () => {
				return tsrest.user.settings.profile.update({
					body: { lang },
				});
			},
			onValid: () => {
				const toasts = createToasts({
					text: lang ? k('settings.experience.lang.toast.targetted') : k('settings.experience.lang.toast.automatic'),
					timeout: 3000,
				});

				if (!userHasJs) {
					throw redirect({ toasts }, event);
				}

				return createPageDataObject({ form, toasts });
			},
		});
	},
} satisfies Actions;
