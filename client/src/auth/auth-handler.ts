import type { GraphQLQuery } from '$/lib/houdini/helper';
import { GetUserFromSessionStore, type GetUserFromSession$result } from '$houdini';

export const AUTH_COOKIE_NAME = 'auth_session';

export async function getAuthUser(query: GraphQLQuery): Promise<GetUserFromSession$result['getSessionUser'] | null> {
	const result = await query(GetUserFromSessionStore);

	if (result.type === 'failure') {
		return null;
	}

	const { getSessionUser: sessionUser } = result.data;

	return sessionUser;
}

export type SessionUser = GetUserFromSession$result['getSessionUser'];