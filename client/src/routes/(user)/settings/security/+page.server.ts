import { createToasts } from '$/lib/components/ToastManager/helper';
import { passwordSchema } from '$/lib/schemas/auth';
import { createPageDataObject } from '$/lib/utils/page-data-object';
import { ChangeSelfPasswordStore } from '$houdini';
import { fail, type Actions } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

const newPasswordFormSchema = z
	.object({
		password: passwordSchema,
		confirm: z.string(),
	})
	.refine(({ password, confirm }) => password === confirm, {
		message: 'Passwords do not match!',
		path: ['confirm'],
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

		if (!form.valid) {
			return fail(StatusCodes.BAD_REQUEST, createPageDataObject({ form }));
		}

		const { password } = form.data;

		const result = await mutate(ChangeSelfPasswordStore, { password });

		if (result.type === 'failure') {
			return result.kitHandler('error');
		}

		const toasts = createToasts([
			{
				text: 'Successfully updated password!',
			},
		]);

		return createPageDataObject({ form, toasts });
	},
} satisfies Actions;
