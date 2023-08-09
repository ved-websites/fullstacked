import { GetChatMessagesStore, SendMessageStore } from '$houdini';
import { error } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
	message: z.string(),
});

export const load = (async ({
	locals: {
		gql: { query },
	},
}) => {
	const { data, errors: gqlError } = await query(GetChatMessagesStore);

	if (gqlError || !data) {
		throw error(StatusCodes.BAD_REQUEST, gqlError?.[0]?.message);
	}

	const form = await superValidate(schema);

	return {
		form,
		messages: data.messages,
	};
}) satisfies PageServerLoad;

export const actions = {
	async default({
		request,
		locals: {
			gql: { mutate },
		},
	}) {
		const form = await superValidate(request, schema);

		const { data, errors: gqlError } = await mutate(SendMessageStore, { message: form.data.message });

		if (gqlError || !data) {
			throw error(StatusCodes.BAD_REQUEST, gqlError?.[0]?.message);
		}

		return { form };
	},
} satisfies Actions;
