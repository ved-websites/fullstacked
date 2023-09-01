import type { AppLocals } from '$/app';
import { GetUserFromSessionStore } from '$houdini';

export const AUTH_COOKIE_NAME = 'auth_session';

export async function getAuthUser(query: AppLocals['gql']['query']) {
	const result = await query(GetUserFromSessionStore);

	if (result.type === 'failure') {
		return null;
	}

	const { getSessionUser: sessionUser } = result.data;

	return sessionUser;
}

export type SessionUser = Awaited<ReturnType<typeof getAuthUser>>;
