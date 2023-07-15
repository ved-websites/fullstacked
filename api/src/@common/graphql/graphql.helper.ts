import { Auth } from '$auth/lucia/lucia.factory';
import { COOKIE_NAME, setupRequest } from '$auth/lucia/lucia.middleware';
import type { Request, Response } from 'express';
import { ConnectionInitMessage, Context } from 'graphql-ws';

export type TypedSubscriptionContext = Context<ConnectionInitMessage['payload'], { request?: Request }>;
export type CommonContext = { req: Request; res: Response };

export function parseCookies(request: Request) {
	const list: Record<string, string> = {};
	const cookieHeader = request.headers?.cookie;

	if (!cookieHeader) return list;

	cookieHeader.split(`;`).forEach(function (cookie) {
		const [name, ...rest] = cookie.split(`=`);

		const trimmedName = name?.trim();

		if (!trimmedName) return;
		const value = rest.join(`=`).trim();

		if (!value) return;
		list[trimmedName] = decodeURIComponent(value);
	});

	return list;
}

export function setupContext(auth: Auth) {
	return async (context: TypedSubscriptionContext | CommonContext) => {
		if ('extra' in context && context?.extra?.request) {
			const request = context?.extra?.request;

			const cookies = parseCookies(request);

			const authSessionCookieToken = cookies[COOKIE_NAME];
			const authSessionHeader = context.connectionParams?.Authorization as string | undefined;

			request.headers.authorization ??= authSessionHeader ?? (authSessionCookieToken ? `Bearer ${authSessionCookieToken}` : undefined);

			await setupRequest(request, auth);

			return {
				req: {
					...request,
					headers: {
						...request.headers,
						...context.connectionParams,
					},
				},
			};
		}

		if (!('req' in context)) {
			throw 'Internal server error';
		}

		return { req: context?.req, res: context?.res };
	};
}
