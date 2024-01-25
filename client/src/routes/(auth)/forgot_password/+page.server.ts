import { createLayoutAlert } from '$lib/components/LayoutAlert/helper';
import { extractErrorMessageFromApiFetcherData } from '$lib/ts-rest/errorHandler';
import { assertTsRestActionResultOK } from '$lib/utils/assertions';
import { createPageDataObject } from '$lib/utils/page-data-object';
import { error } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { redirect } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms/client';
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

		error(result.status, extractErrorMessageFromApiFetcherData(result));
	})();

	if (resetToken && user) {
		const form = await superValidate(resetPasswordSchema);

		setHeaders({
			'Referrer-Policy': 'no-referrer',
		});

		return createPageDataObject({ form, resetToken, user });
	}

	const form = await superValidate(requestPasswordSchema);

	return createPageDataObject({ form, resetToken: null });
}) satisfies PageServerLoad;

export const actions = {
	requestPasswordReset: async (event) => {
		const {
			request,
			locals: { tsrest },
		} = event;

		const form = await superValidate(request, requestPasswordSchema);

		return assertTsRestActionResultOK({
			form,
			result: () => tsrest.auth.forgotPasswordRequest({ query: form.data }),
			onValid: () => {
				const layoutAlert = createLayoutAlert({
					text: k('(auth).forgot_password.request.alert'),
				});

				throw redirect({ layoutAlert }, event);
			},
		});
	},
	resetPassword: async (event) => {
		const {
			request,
			locals: { tsrest },
		} = event;

		const form = await superValidate(request, resetPasswordSchema);

		return assertTsRestActionResultOK({
			form,
			result: () => tsrest.auth.resetPassword({ body: form.data }),
			onValid: () => {
				throw redirect(
					'/login',
					{
						layoutAlert: createLayoutAlert({
							text: k('(auth).forgot_password.reset.action.success'),
						}),
					},
					event,
				);
			},
		});
	},
} satisfies Actions;
