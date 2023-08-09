import { CreateNewUserStore } from '$houdini';
import { redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { superValidate } from 'sveltekit-superforms/server';
import { userFormSchema } from '../components/userform.schema';
import type { Actions } from './$types';

export const actions = {
	default: async ({
		request,
		locals: {
			gql: { mutate },
		},
	}) => {
		const form = await superValidate(request, userFormSchema);

		if (!form.valid) return { form };

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
			return result.kitHandler('formMessage', { form });
			// return message(form, errors?.at(0)?.message);
		}

		throw redirect(StatusCodes.SEE_OTHER, '/users');
	},
} satisfies Actions;
