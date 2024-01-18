import { ChangeLangStore } from '$houdini';
import { locales } from '$i18n-config';
import { createToasts } from '$lib/components/ToastManager/helper';
import { createPageDataObject } from '$lib/utils/page-data-object';
import { fail, type Actions } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { redirect } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import { k } from '~shared';
import type { PageServerLoad } from './$types';

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
			locals: {
				gql: { mutate },
				userHasJs,
			},
		} = event;

		const form = await superValidate(request, langSchema);

		if (!form.valid) {
			return fail(StatusCodes.BAD_REQUEST, createPageDataObject({ form }));
		}

		const { lang: formLang } = form.data;

		const lang = locales.includes(formLang as string) ? formLang : null;

		const result = await mutate(ChangeLangStore, { lang });

		if (result.type === 'failure') {
			return result.kitHandler('error');
		}

		const toasts = (() => {
			const text = lang ? k('settings.experience.lang.toast.targetted') : k('settings.experience.lang.toast.automatic');

			return createToasts([
				{
					text,
					timeout: 3000,
				},
			]);
		})();

		if (!userHasJs) {
			throw redirect({ toasts }, event);
		}

		return createPageDataObject({ form, toasts });
	},
} satisfies Actions;
