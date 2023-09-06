import { createLayoutAlert } from '$/lib/components/LayoutAlert/helper';
import { createToasts } from '$/lib/components/ToastManager/helper';
import { emailSchema, passwordSchema } from '$/lib/schemas/auth';
import { createPageDataObject } from '$/lib/utils/page-data-object';
import { LoginStore } from '$houdini';
import { redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
	email: emailSchema,
	password: passwordSchema,
});

export const load = (async ({ url, locals: { sessionUser } }) => {
	const form = await superValidate(schema);

	const redirectTo = getRedirectTo(url);

	if (sessionUser) {
		throw redirect(StatusCodes.SEE_OTHER, redirectTo || '/');
	}

	const layoutAlert = (() => {
		if (!redirectTo) {
			return;
		}

		return createLayoutAlert({
			text: `Vous devez être connecté pour accéder à cette ressource!`,
			level: 'warning',
		});
	})();

	return createPageDataObject({ form, layoutAlert });
}) satisfies PageServerLoad;

export const actions = {
	default: async ({
		request,
		url,
		locals: {
			gql: { mutate },
		},
	}) => {
		const form = await superValidate(request, schema);

		if (!form.valid) return { form };

		const { email, password } = form.data;

		const result = await mutate(LoginStore, { email, password });

		if (result.type === 'failure') {
			const invalidUserPassErrorCatcher = 'Invalid';

			const { errors } = result;

			const allErrors = createToasts(
				errors
					?.filter(({ message }) => !message.includes(invalidUserPassErrorCatcher))
					.map(({ message }) => ({
						text: message,
						type: 'error',
					})),
			);

			const gqlUserPassError = errors && errors.find(({ message }) => message.includes(invalidUserPassErrorCatcher));

			const userPassError =
				gqlUserPassError &&
				createLayoutAlert({
					text: gqlUserPassError.message,
					level: 'error',
				});

			return result.kitHandler('failure', {
				code: StatusCodes.UNAUTHORIZED,
				data: createPageDataObject({ form, toasts: allErrors, layoutAlert: userPassError }),
			});
		}

		const redirectTo = getRedirectTo(url) || '/';

		// Successful login
		throw redirect(StatusCodes.SEE_OTHER, redirectTo);
	},
} satisfies Actions;

function getRedirectTo(url: URL) {
	const redirectToParam = url.searchParams.get('redirectTo');

	if (redirectToParam === null) {
		return false;
	}

	const redirectTo: `/${string}` = `/${redirectToParam.slice(1)}`;

	return redirectTo;
}
