import { createToasts } from '$lib/components/ToastManager/helper';
import { assertTsRestActionResultOK } from '$lib/utils/assertions';
import { streamed } from '$lib/utils/streaming';
import { StatusCodes } from 'http-status-codes';
import { redirect } from 'sveltekit-flash-message/server';
import { emailSchema } from '~shared';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals: { tsrest } }) => {
	const users = streamed(async () => {
		const result = await tsrest.users.admin.listUsers({
			skipErrorHandling: true,
		});

		if (result.status !== StatusCodes.OK) {
			throw new Error(result.body.message);
		}

		return result.body;
	});

	return { users };
}) satisfies PageServerLoad;

export const actions = {
	delete: async (event) => {
		const {
			request,
			locals: { tsrest },
		} = event;

		const formdata = await request.formData();

		const email = await emailSchema.parseAsync(formdata.get('email')).catch(() => {
			throw redirect(
				'/admin/users',
				{
					toasts: createToasts({
						text: 'admin.users.actions.delete.errors.missing-email.error' satisfies I18nKey,
						type: 'warning',
						extraData: 'admin.users.actions.delete.errors.missing-email.details' satisfies I18nKey,
					}),
				},
				event,
			);
		});

		return assertTsRestActionResultOK({
			event,
			result: () => tsrest.users.admin.deleteUser({ body: { email } }),
			onValid: () => ({
				toasts: createToasts({
					text: 'admin.users.actions.delete.success' satisfies I18nKey,
					i18nPayload: { email },
				}),
			}),
		});
	},
} satisfies Actions;
