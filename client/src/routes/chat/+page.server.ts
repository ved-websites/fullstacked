import { SendMessageStore } from '$houdini';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions } from './$types';
import { schema } from './schema';

export const actions = {
	async default({
		request,
		locals: {
			gql: { mutate },
		},
	}) {
		const form = await superValidate(request, schema);

		const result = await mutate(SendMessageStore, { message: form.data.message });

		if (result.type === 'failure') {
			return result.kitHandler('error');
		}

		return { form };
	},
} satisfies Actions;
