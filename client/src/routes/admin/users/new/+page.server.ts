import { createToasts } from '$/lib/components/ToastManager/helper';
import { CreateNewUserStore, GetRolesForNewUserStore } from '$houdini';
import { fail, redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { adminNewUserFormSchema } from '../schema/schema';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({
	locals: {
		gql: { query },
	},
}) => {
	const result = await query(GetRolesForNewUserStore);

	if (result.type === 'failure') {
		return result.kitHandler('redirect');
	}

	const form = await superValidate(adminNewUserFormSchema);

	return {
		form,
		roles: result.data.getRoles,
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({
		request,
		locals: {
			gql: { mutate },
		},
	}) => {
		const form = await superValidate(request, adminNewUserFormSchema);

		if (!form.valid) {
			return { form };
		}

		const { email, firstName, lastName, roles } = form.data;

		const result = await mutate(CreateNewUserStore, {
			email,
			firstName,
			lastName,
			roles: {
				connect: roles.map((role) => ({
					text: role,
				})),
			},
		});

		if (result.type === 'failure') {
			return result.kitHandler('custom', ({ errors }) => {
				const error = errors!.at(0)!;

				const errorMessage = error.message;
				const errorStatus = error.extensions.originalError.statusCode;

				if (errorStatus == StatusCodes.BAD_REQUEST) {
					setError(form, 'email', errorMessage);
				} else {
					setError(form, errorMessage);
				}

				const toasts = createToasts([
					{
						text: 'Error creating new user!',
						type: 'error',
					},
				]);

				return fail(StatusCodes.BAD_REQUEST, { form, toasts });
			});
		}

		throw redirect(StatusCodes.SEE_OTHER, '/admin/users');
	},
} satisfies Actions;
