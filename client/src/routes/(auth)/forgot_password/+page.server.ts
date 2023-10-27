import { ExecutePasswordResetStore, RequestPasswordResetStore, VerifyPasswordResetAttemptStore } from '$houdini';
import { k } from '$i18n';
import { createLayoutAlert } from '$lib/components/LayoutAlert/helper';
import { createPageDataObject } from '$lib/utils/page-data-object';
import { redirect } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms/client';
import type { Actions, PageServerLoad } from './$types';
import { requestPasswordSchema, resetPasswordSchema } from './schemas';

export const load = (async ({
	url,
	locals: {
		gql: { query },
	},
}) => {
	const resetToken = url.searchParams.get('resetToken');

	const user = await (async () => {
		if (!resetToken) {
			return null;
		}

		const result = await query(VerifyPasswordResetAttemptStore, {
			variables: {
				token: resetToken,
			},
		});

		if (result.type === 'failure') {
			throw result.kitHandler('error');
		}

		return result.data.verifyPasswordResetAttempt;
	})();

	if (resetToken && user) {
		const form = await superValidate(resetPasswordSchema);

		return createPageDataObject({ form, resetToken, user });
	}

	const form = await superValidate(requestPasswordSchema);

	return createPageDataObject({ form, resetToken: null });
}) satisfies PageServerLoad;

export const actions = {
	requestPasswordReset: async (event) => {
		const {
			request,
			locals: {
				gql: { mutate },
			},
		} = event;

		const form = await superValidate(request, requestPasswordSchema);

		if (!form.valid) return { form };

		const result = await mutate(RequestPasswordResetStore, {
			email: form.data.email,
		});

		if (result.type === 'failure') {
			return result.kitHandler('failure', { data: createPageDataObject({ form }) });
		}

		const layoutAlert = createLayoutAlert({
			text: k('(auth).forgot_password.request.alert'),
		});

		throw redirect({ layoutAlert }, event);
	},
	resetPassword: async (event) => {
		const {
			request,
			locals: {
				gql: { mutate },
			},
		} = event;

		const form = await superValidate(request, resetPasswordSchema);

		if (!form.valid) return { form };

		const { token, password } = form.data;

		if (!token) {
			throw redirect(
				{
					layoutAlert: createLayoutAlert({
						text: `No reset token provided!`,
					}),
				},
				event,
			);
		}

		const result = await mutate(ExecutePasswordResetStore, {
			token,
			password,
		});

		if (result.type === 'failure') {
			return result.kitHandler('error');
		}

		throw redirect('/login', {}, event);
	},
} satisfies Actions;
