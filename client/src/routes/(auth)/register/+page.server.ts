import { GetUnregisteredUserStore, RegisterNewUserStore } from '$houdini';
import { firstNameSchema, lastNameSchema, passwordSchema } from '$lib/schemas/auth';
import { error, redirect, type Actions } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

const schema = z.object({
	registerToken: z.string(),
	firstName: firstNameSchema,
	lastName: lastNameSchema,
	password: passwordSchema,
});

export const load = (async ({
	url,
	locals: {
		gql: { query },
	},
}) => {
	const registerToken = url.searchParams.get('token');

	if (!registerToken) {
		throw error(StatusCodes.BAD_REQUEST, { message: 'Missing register token!' });
	}

	const { data } = await query(GetUnregisteredUserStore, {
		variables: {
			registerToken,
		},
	});

	if (!data) {
		throw redirect(StatusCodes.SEE_OTHER, `/`);
	}

	const {
		getUnregisteredUser: { email, ...attributes },
	} = data;

	const form = await superValidate({ registerToken, ...attributes }, schema);

	return {
		form,
		userEmail: email,
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({
		request,
		locals: {
			gql: { mutate },
		},
	}) => {
		const form = await superValidate(request, schema);

		if (!form.valid) return { form };

		const result = await mutate(RegisterNewUserStore, { data: { ...form.data } });

		if (result.type === 'failure') {
			return result.kitHandler('formMessage', { form });
		}

		throw redirect(StatusCodes.SEE_OTHER, '/');
	},
} satisfies Actions;
