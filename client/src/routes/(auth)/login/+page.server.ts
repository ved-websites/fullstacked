import { createLayoutAlert } from '$lib/components/LayoutAlert/helper';
import { assertTsRestActionResultOK } from '$lib/utils/assertions';
import { createPageDataObject } from '$lib/utils/page-data-object';
import { redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import { emailSchema, passwordSchema } from '~shared';
import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
	email: emailSchema,
	password: passwordSchema,
});

export const load = (async ({ url, locals: { sessionUser } }) => {
	const form = await superValidate(schema);

	const redirectTo = getRedirectTo(url);

	if (sessionUser) {
		throw redirect(StatusCodes.SEE_OTHER, redirectTo ?? '/');
	}

	const layoutAlert = (() => {
		if (!redirectTo) {
			return;
		}

		return createLayoutAlert({
			text: `Vous devez être connecté pour accéder à cette ressource!`, // TODO : i18n
			level: 'warning',
		});
	})();

	return createPageDataObject({ form, layoutAlert });
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, url, locals: { tsrest } }) => {
		const form = await superValidate(request, schema);

		return assertTsRestActionResultOK({
			form,
			result: () => tsrest.auth.login({ body: form.data }),
			onValid: () => {
				const redirectTo = getRedirectTo(url) ?? '/';

				// Successful login
				throw redirect(StatusCodes.SEE_OTHER, redirectTo);
			},
		});
	},
} satisfies Actions;

function getRedirectTo(url: URL) {
	const redirectToParam = url.searchParams.get('redirectTo');

	if (redirectToParam === null) {
		return null;
	}

	const redirectTo: `/${string}` = `/${redirectToParam.slice(1)}`;

	return redirectTo;
}
