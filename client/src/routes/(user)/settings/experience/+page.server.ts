import { createPageDataObject } from '$/lib/utils/page-data-object';
import { ChangeLangStore } from '$houdini';
import { locales } from '$i18n';
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

		const { lang } = form.data;

		const fLang = locales.get().includes(lang as string) ? lang : null;

		const result = await mutate(ChangeLangStore, { lang: fLang });

		if (result.type === 'failure') {
			return result.kitHandler('error');
		}

		throw redirect(StatusCodes.MOVED_TEMPORARILY, request.url);
	},
} satisfies Actions;
