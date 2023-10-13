import { createToasts } from '$/lib/components/ToastManager/helper';
import { createPageDataObject } from '$/lib/utils/page-data-object';
import { ChangeLangStore } from '$houdini';
import { l, locales, setLocale } from '$i18n';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

const langSchema = z.object({
	lang: z.nullable(z.string()),
});

export const load = (async ({ locals: { sessionUser } }) => {
	const lang = sessionUser!.lang;

	const form = await superValidate<typeof langSchema, string>({ lang }, langSchema);

	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({
		request,
		locals: {
			gql: { mutate },
			userHasJs,
			browserLang,
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

		if (!userHasJs) {
			throw redirect(StatusCodes.MOVED_TEMPORARILY, request.url);
		}

		const toasts = (() => {
			const text = lang
				? l.get(browserLang, 'settings.experience.lang.toast.targetted')
				: l.get(browserLang, 'settings.experience.lang.toast.automatic');

			return createToasts([
				{
					text,
					timeout: 3000,
				},
			]);
		})();

		return createPageDataObject({ form, toasts });
	},
} satisfies Actions;
