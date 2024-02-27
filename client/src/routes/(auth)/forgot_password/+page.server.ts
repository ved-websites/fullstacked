import { createLayoutAlert } from '$lib/components/LayoutAlert/helper';
import { extractErrorMessageFromApiFetcherData } from '$lib/ts-rest/errorHandler';
import type { PageMessages } from '$lib/types';
import { assertTsRestActionResultOK } from '$lib/utils/assertions';
import { error } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { k } from '~shared';
import type { Actions, PageServerLoad } from './$types';
import { requestPasswordSchema, resetPasswordSchema } from './schemas';

export const load = (async ({ url, locals: { tsrest }, setHeaders }) => {
	const resetToken = url.searchParams.get('resetToken');

	const user = await (async () => {
		if (!resetToken) {
			return null;
		}

		const result = await tsrest.auth.verifyPasswordResetAttempt({
			query: { resetToken },
			skipErrorHandling: true,
		});

		if (result.status === StatusCodes.BAD_REQUEST) {
			return null;
		}

		if (result.status === StatusCodes.OK) {
			return result.body;
		}

		error(result.status, await extractErrorMessageFromApiFetcherData(result));
	})();

	if (resetToken && user) {
		const form = await superValidate(zod(resetPasswordSchema));

		setHeaders({
			'Referrer-Policy': 'no-referrer',
		});

		return { form, resetToken, user } satisfies PageMessages;
	}

	const form = await superValidate(zod(requestPasswordSchema));

	return { form, resetToken: null } satisfies PageMessages;
}) satisfies PageServerLoad;

export const actions = {
	requestPasswordReset: async ({ request, locals: { tsrest }, cookies }) => {
		const form = await superValidate(request, zod(requestPasswordSchema));

		return assertTsRestActionResultOK({
			form,
			cookies,
			result: () => tsrest.auth.forgotPasswordRequest({ query: form.data }),
			onValid: () => ({
				layoutAlert: createLayoutAlert({
					text: k('(auth).forgot_password.request.alert'),
				}),
			}),
		});
	},
	resetPassword: async ({ request, locals: { tsrest }, cookies }) => {
		const form = await superValidate(request, zod(resetPasswordSchema));

		return assertTsRestActionResultOK({
			form,
			cookies,
			result: () => tsrest.auth.resetPassword({ body: form.data }),
			onValid: () => ({
				redirectTo: '/login',
				layoutAlert: createLayoutAlert({
					text: k('(auth).forgot_password.reset.action.success'),
				}),
			}),
		});
	},
} satisfies Actions;
