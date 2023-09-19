import { createPageDataObject } from '$/lib/utils/page-data-object';
import { GetChatMessagesStore, SendMessageStore } from '$houdini';
import { fail } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { schema } from './schema';

export const load = (async ({
	locals: {
		gql: { query },
	},
}) => {
	const form = await superValidate(schema);

	const result = await query(GetChatMessagesStore);

	if (result.type === 'failure') {
		throw fail(StatusCodes.BAD_REQUEST, createPageDataObject({ form }));
	}

	return { form, chatMessages: result.data.messages };
}) satisfies PageServerLoad;

export const actions = {
	async default({
		request,
		locals: {
			gql: { mutate },
		},
	}) {
		const form = await superValidate(request, schema);

		if (!form.valid) {
			return fail(StatusCodes.BAD_REQUEST, createPageDataObject({ form }));
		}

		const result = await mutate(SendMessageStore, { message: form.data.message });

		if (result.type === 'failure') {
			return result.kitHandler('error');
		}

		return { form };
	},
} satisfies Actions;
