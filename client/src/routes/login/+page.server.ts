import { createLayoutAlert } from '$/lib/components/LayoutAlert/helper';
import { createToasts } from '$/lib/components/ToastManager/helper';
import { emailSchema, passwordSchema } from '$/lib/schemas/auth';
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

export const load = (async ({ url }) => {
	const form = await superValidate(schema);

	const redirectTo = url.searchParams.has('redirectTo') || undefined;

	const layoutAlert =
		redirectTo &&
		createLayoutAlert({
			text: `Vous devez être connecté pour accéder à cette ressource!`,
			level: 'warning',
		});

	return { form, layoutAlert };
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
				data: { form, toasts: allErrors, layoutAlert: userPassError },
			});
		}

		const redirectToParam = url.searchParams.get('redirectTo');

		const redirectTo = redirectToParam ? `/${redirectToParam.slice(1)}` : `/`;

		// Successful login
		throw redirect(StatusCodes.SEE_OTHER, redirectTo);
	},
} satisfies Actions;
