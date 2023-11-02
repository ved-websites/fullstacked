import { GetUserFromSessionStore, type GetUserFromSession$result } from '$houdini';
import type { GraphQLQuery } from '$lib/houdini/helper';

export const AUTH_COOKIE_NAME = 'auth_session';

export async function getAuthUser(query: GraphQLQuery): Promise<SessionUser> {
	const result = await query(GetUserFromSessionStore);

	if (result.type === 'failure') {
		return null;
	}

	const { getSessionUser: sessionUser } = result.data;

	return sessionUser;
}

export type SessionUser = ConfirmedSessionUser | null;
export type ConfirmedSessionUser = GetUserFromSession$result['getSessionUser'];
