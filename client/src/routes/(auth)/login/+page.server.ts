import { createLayoutAlert } from '$lib/components/LayoutAlert/helper';
import type { PageMessages } from '$lib/types';
import { assertTsRestActionResultOK } from '$lib/utils/assertions';
import { redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { emailSchema, passwordSchema } from '~shared';
import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
	email: emailSchema,
	password: passwordSchema,
});

export const load = (async ({ url, locals: { sessionUser } }) => {
	const form = await superValidate(zod(schema));

	const redirectTo = getRedirectTo(url);

	if (sessionUser) {
		redirect(StatusCodes.SEE_OTHER, redirectTo ?? '/');
	}

	const layoutAlert = (() => {
		if (!redirectTo) {
			return;
		}

		return createLayoutAlert({
			text: '(auth).login.errors.access' satisfies I18nKey,
			type: 'warning',
		});
	})();

	return { form, layoutAlert } satisfies PageMessages;
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const {
			request,
			url,
			locals: { tsrest },
		} = event;

		const form = await superValidate(request, zod(schema));

		return assertTsRestActionResultOK({
			form,
			event,
			result: () => tsrest.auth.login({ body: form.data }),
			onValid: () => ({ redirectTo: getRedirectTo(url) ?? '/' }),
			layoutAlert: {},
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
