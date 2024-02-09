import type { TsRestClient } from '$lib/ts-rest/client';
import { assertTsRestResultOK } from '$lib/utils/assertions';
import { StatusCodes } from 'http-status-codes';
import { SESSION_COOKIE_NAME } from '~shared';

export async function getAuthUser(tsrest: TsRestClient) {
	const result = await tsrest.auth.session({
		onCommonError: ({ data, event }) => {
			if (event && data.status === StatusCodes.UNAUTHORIZED) {
				event.cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
			}
		},
	});

	assertTsRestResultOK(result);

	const sessionUser = result.body;

	return sessionUser;
}

export type SessionUser = Awaited<ReturnType<typeof getAuthUser>>;
export type ConfirmedSessionUser = NonNullable<SessionUser>;
