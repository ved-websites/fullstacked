import type { TsRestClient } from '$lib/ts-rest/client';
import { StatusCodes } from 'http-status-codes';
import { SESSION_COOKIE_NAME } from '~shared';

export async function getAuthUser(tsrest: TsRestClient) {
	const result = await tsrest.auth.session({
		onCommonError: ({ data, event }) => {
			if (event && data.status === StatusCodes.UNAUTHORIZED) {
				event.cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
			}
		},
		autoRouteOtherErrors: false,
	});

	// @ts-expect-error Internal status that specifies if the backend server is down.
	if (result.status === StatusCodes.IM_A_TEAPOT) {
		// Routes / components can use the check `sessionUser === undefined` to
		// check if the server was down.
		return undefined;
	}

	if (result.status !== StatusCodes.OK) {
		return null;
	}

	const sessionUser = result.body;

	return sessionUser;
}

export type SessionUser = Awaited<ReturnType<typeof getAuthUser>>;
export type ConfirmedSessionUser = NonNullable<SessionUser>;
