import { assertFormValid, assertTsRestResultOK } from '$lib/utils/assertions';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { schema } from './schema';

export const load = (async ({ locals: { tsrest } }) => {
	const form = await superValidate(schema);

	const result = await tsrest.messages.list({
		errPageData: { form },
	});

	assertTsRestResultOK(result);

	return { form, chatMessages: result.body };
}) satisfies PageServerLoad;

export const actions = {
	async default({ request, locals: { tsrest } }) {
		const form = await superValidate(request, schema);

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
