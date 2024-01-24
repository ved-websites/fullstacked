import type { TsRestClient } from '$lib/ts-rest/client';
import { assertTsRestResultOK } from '$lib/utils/assertions';

export const AUTH_COOKIE_NAME = 'auth_session';

export async function getAuthUser(tsrest: TsRestClient) {
	const result = await tsrest.auth.session();

	assertTsRestResultOK(result);

	const sessionUser = result.body;

	return sessionUser;
}

export type SessionUser = Awaited<ReturnType<typeof getAuthUser>>;
export type ConfirmedSessionUser = NonNullable<SessionUser>;
