import { DeleteSpecificUserStore } from '$houdini';
import { createToasts } from '$lib/components/ToastManager/helper';
import type { PageDataObject } from '$lib/utils/page-data-object';
import { redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { emailSchema } from '~shared';
import type { Actions } from '../$types';
import type { PageServerLoad } from './$types';

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
	delete: async ({
		request,
		locals: {
			gql: { mutate },
		},
	}) => {
		const formdata = await request.formData();

		const email = await emailSchema.parseAsync(formdata.get('email')).catch(() => {
			throw redirect(StatusCodes.SEE_OTHER, '/admin/users?error=Missing email!');
		});

		const result = await mutate(DeleteSpecificUserStore, { email });

		if (result.type === 'failure') {
			return result.kitHandler('failure');
		}

		const toasts = createToasts([
			{
				text: `Successfully deleted user "${email}"!`,
			},
		]);

		return { toasts } satisfies PageDataObject;
	},
} satisfies Actions;
