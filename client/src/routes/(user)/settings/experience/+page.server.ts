import { createToasts } from '$/lib/components/ToastManager/helper';
import { createPageDataObject } from '$/lib/utils/page-data-object';
import { ChangeLangStore } from '$houdini';
import { locales, setLocale, t } from '$i18n';
import { fail, type Actions } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

const langSchema = z.object({
	lang: z.nullable(z.string()),
});

export const load = (async ({ locals: { sessionUser } }) => {
	const lang = sessionUser!.lang;

	const form = await superValidate({ lang }, langSchema);

	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({
		request,
		locals: {
			gql: { mutate },
		},
	}) => {
		const form = await superValidate(request, langSchema);

		if (!form.valid) {
			return fail(StatusCodes.BAD_REQUEST, createPageDataObject({ form }));
		}

		const { lang: formLang } = form.data;

		const lang = locales.get().includes(formLang as string) ? formLang : null;

		await setLocale(lang ?? undefined);

		const result = await mutate(ChangeLangStore, { lang });

		if (result.type === 'failure') {
			return result.kitHandler('error');
		}

		const toasts = (() => {
			if (!lang) {
				return createToasts([
					{
						text: t.get('settings.experience.lang.toast.automatic'),
					},
				]);
			}

			return createToasts([
				{
					text: t.get('settings.experience.lang.toast.targetted'),
				},
			]);
		})();

		return createPageDataObject({ form, toasts });
	},
} satisfies Actions;
