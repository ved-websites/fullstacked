import { redirect, type RequestEvent } from '@sveltejs/kit';
import type { AnyVariables } from '@urql/svelte';
import { StatusCodes } from 'http-status-codes';
import { handleLoginRedirect } from './login';

export const AUTH_COOKIE_NAME = 'auth_session';

export async function simpleQuery<Data, Variables extends AnyVariables = AnyVariables>(
	event: RequestEvent,
	...args: Parameters<typeof event.locals.urql.query<Data, Variables>>
) {
	const simpleQueryResult = await event.locals.urql.query(...args).toPromise();

	const { data, error } = simpleQueryResult;

	if (error || !data) {
		if (error?.graphQLErrors.some((gqlError) => gqlError.extensions.code === 'UNAUTHENTICATED')) {
			throw redirect(StatusCodes.SEE_OTHER, handleLoginRedirect(event.url));
		}
		if (error?.graphQLErrors.some((gqlError) => gqlError.extensions.code === 'FORBIDDEN')) {
			const refererHeader = event.request.headers.get('referer');

			const forbiddenRedirect = `/?forbidden`;

			if (!refererHeader?.startsWith(event.url.origin)) {
				throw redirect(StatusCodes.SEE_OTHER, forbiddenRedirect);
			}

			const refererHeaderUrl = new URL(refererHeader);

			throw redirect(StatusCodes.SEE_OTHER, `${refererHeaderUrl.pathname}${forbiddenRedirect}`);
		}

		throw redirect(StatusCodes.SEE_OTHER, `/`);
	}

	return data;
}
