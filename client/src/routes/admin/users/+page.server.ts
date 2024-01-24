import { createToasts } from '$lib/components/ToastManager/helper';
import { assertTsRestActionResultOK } from '$lib/utils/assertions';
import type { PageDataObject } from '$lib/utils/page-data-object';
import { StatusCodes } from 'http-status-codes';
import { redirect } from 'sveltekit-flash-message/server';
import { emailSchema } from '~shared';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals: { tsrest } }) => {
	const getUsers = async () => {
		const result = await tsrest.users.admin.listUsers({
			skipErrorHandling: true,
		});

		if (result.status !== StatusCodes.OK) {
			throw new Error(result.body.message);
		}

		return result.body.reduce(
			([regUsers, unregUsers], user) => {
				if (user.registerToken) {
					unregUsers!.push(user);
				} else {
					regUsers!.push(user);
				}

				return [regUsers!, unregUsers!];
			},
			[[] as typeof result.body, [] as typeof result.body],
		);
	};

	const users = getUsers();

	users.catch(() => {
		// don't handle errors
	});

	return {
		streamed: {
			users,
		},
	};
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
						text: 'Missing email!', // TODO : i18n
						type: 'warning',
						extraData: `You shouldn't play with the HTML you sneaky dork :)`, // TODO : i18n
					}),
				},
				event,
			);
		});

		return assertTsRestActionResultOK({
			result: () => tsrest.users.admin.deleteUser({ body: { email } }),
			onValid: () => {
				const toasts = createToasts({
					text: `Successfully deleted user "${email}"!`, // TODO : i18n
				});

				return { toasts } satisfies PageDataObject;
			},
		});
	},
} satisfies Actions;
