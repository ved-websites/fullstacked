import { createToasts } from '$lib/components/ToastManager/helper';
import { assertTsRestActionResultOK } from '$lib/utils/assertions';
import { stringParamsFromUrl } from '$lib/utils/urls';
import type { Actions } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { redirect } from 'sveltekit-flash-message/server';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import { emailSchema, k } from '~shared';
import type { PageServerLoad } from './$types';

const emailChangeSchema = z.object({
	email: emailSchema,
});

export type EmailFlashProps = Partial<{
	hasUpdatedEmail: boolean;
}>;

export const load = (async (event) => {
	const {
		locals: { tsrest },
		url,
		cookies,
	} = event;
	const paramTokenKey = 'token';

	const token = url.searchParams.get(paramTokenKey);

	const form = await superValidate(emailChangeSchema);

	if (token) {
		const result = await tsrest.user.settings.profile.updateEmail({ body: { token } });

		let hasUpdatedEmail = false;

		if (result.status === StatusCodes.OK) {
			hasUpdatedEmail = result.body.success;
		}

		redirect(stringParamsFromUrl(url, paramTokenKey), { hasUpdatedEmail } satisfies EmailFlashProps, cookies);
	}

	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const {
			request,
			locals: { tsrest },
		} = event;

		const form = await superValidate(request, emailChangeSchema);

		return assertTsRestActionResultOK({
			form,
			event,
			result: () => tsrest.user.settings.profile.requestUpdateEmail({ body: form.data }),
			onNotOk: (result, { errorMessage }) => {
				if (result.status == StatusCodes.FORBIDDEN) {
					return setError(form, 'email', errorMessage);
				}
			},
			onValid: () => {
				return {
					toasts: createToasts({
						text: k('settings.profile.email.request.success'),
						i18nPayload: { email: form.data.email },
					}),
				};
			},
		});
	},
} satisfies Actions;