import type { CanUserSendEmailQuery, CanUserSendEmailQueryVariables } from '$/graphql/@generated';
import type { Config } from '@sveltejs/adapter-vercel';
import { error } from '@sveltejs/kit';
import { gql } from '@urql/svelte';
import { StatusCodes } from 'http-status-codes';
import Email from 'vercel-email';
import type { Actions } from './$types';
import { sendEmailSchema } from './schemas';

export const config: Config = {
	runtime: 'edge',
};

export const actions = {
	default: async ({ request: { body }, locals: { urql } }) => {
		const emailData = await sendEmailSchema.parseAsync(body).catch(() => {
			throw error(StatusCodes.BAD_REQUEST);
		});

		const { data, error: gqlError } = await urql
			.mutation(
				gql<CanUserSendEmailQuery, CanUserSendEmailQueryVariables>`
					query CanUserSendEmail {
						canSendEmail {
							value
						}
					}
				`,
				{},
			)
			.toPromise();

		if (gqlError || !data) {
			throw error(StatusCodes.BAD_REQUEST, gqlError?.message);
		}

		if (!data.canSendEmail.value) {
			throw error(StatusCodes.FORBIDDEN);
		}

		// @ts-expect-error Wonky types makes typescript angry
		await Email.send(emailData);

		return {};
	},
} satisfies Actions;
