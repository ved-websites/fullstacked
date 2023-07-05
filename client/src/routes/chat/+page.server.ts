import {
	ChatMessageFragmentDoc,
	type GetChatMessagesQuery,
	type GetChatMessagesQueryVariables,
	type SendMessageMutation,
	type SendMessageMutationVariables,
} from '$/graphql/@generated';
import { error } from '@sveltejs/kit';
import { gql } from '@urql/svelte';
import { StatusCodes } from 'http-status-codes';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
	message: z.string(),
});

export const load = (async ({ locals: { urql } }) => {
	const { data, error: gqlError } = await urql.query(
		gql<GetChatMessagesQuery, GetChatMessagesQueryVariables>`
			${ChatMessageFragmentDoc}

			query GetChatMessages {
				messages {
					...ChatMessage
				}
			}
		`,
		{},
	);

	if (gqlError || !data) {
		throw error(StatusCodes.BAD_REQUEST, gqlError?.message);
	}

	const form = await superValidate(schema);

	return {
		form,
		messages: data.messages,
	};
}) satisfies PageServerLoad;

export const actions = {
	async default({ request, locals: { urql } }) {
		const form = await superValidate(request, schema);

		const { data, error: gqlError } = await urql.mutation(
			gql<SendMessageMutation, SendMessageMutationVariables>`
				mutation SendMessage($message: String!) {
					addMessage(data: { text: $message }) {
						text
					}
				}
			`,
			{ message: form.data.message },
		);

		if (gqlError || !data) {
			throw error(StatusCodes.BAD_REQUEST, gqlError?.message);
		}

		return { form };
	},
} satisfies Actions;
