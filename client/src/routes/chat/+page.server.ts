import { assertFormValid, assertTsRestResultOK } from '$lib/utils/assertions';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { chatSchema } from './schema';

export const load = (async ({ locals: { tsrest } }) => {
	const form = await superValidate(zod(chatSchema));

	const result = await tsrest.messages.list({
		errPageData: { form },
	});

	assertTsRestResultOK(result);

	return { form, chatMessages: result.body };
}) satisfies PageServerLoad;

export const actions = {
	async default({ request, locals: { tsrest } }) {
		const form = await superValidate(request, zod(chatSchema));

		return assertFormValid(form, async () => {
			const result = await tsrest.messages.new({
				body: { text: form.data.message },
				errPageData: { form },
			});

			assertTsRestResultOK(result);

			return { form };
		});
	},
} satisfies Actions;
