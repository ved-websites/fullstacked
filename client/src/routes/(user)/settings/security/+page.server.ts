import { passwordSchema } from '$/lib/schemas/auth';
import { ChangeSelfPasswordStore } from '$houdini';
import { redirect, type Actions } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

const newPasswordFormSchema = z.object({
	password: passwordSchema,
});

export const load = (async () => {
	const form = await superValidate(newPasswordFormSchema);

	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({
		request,
		locals: {
			gql: { mutate },
		},
	}) => {
		const form = await superValidate(request, newPasswordFormSchema);

		if (!form.valid) return { form };

		const { password } = form.data;

		const result = await mutate(ChangeSelfPasswordStore, { password });

		if (result.type === 'failure') {
			return result.kitHandler('error');
		}

		throw redirect(StatusCodes.SEE_OTHER, '/settings/security');
	},
} satisfies Actions;
