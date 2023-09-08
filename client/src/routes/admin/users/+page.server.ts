import { createToasts } from '$/lib/components/ToastManager/helper';
import { emailSchema } from '$/lib/schemas/auth';
import type { PageDataObject } from '$/lib/utils/page-data-object';
import { DeleteSpecificUserStore } from '$houdini';
import { redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import type { Actions } from '../$types';

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
