import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { SESSION_COOKIE_NAME } from '~shared';
import { Auth, LuciaFactory } from './lucia.factory';
import { LuciaContainer } from './types';

@Injectable()
export class LuciaMiddleware implements NestMiddleware {
	constructor(@Inject(LuciaFactory) private readonly auth: Auth) {}

	async use(request: Request, response: Response, next: NextFunction) {
		const authSessionCookieToken = request.cookies?.[SESSION_COOKIE_NAME] as string | undefined;
		const authSessionHeader = request.headers.authorization;

		if (authSessionCookieToken && !authSessionHeader) {
			request.headers.authorization = `Bearer ${authSessionCookieToken}`;
		}

		await setupRequest(request, this.auth);

		if (request.session && request.session.fresh) {
			// Refresh cookie when required.
			const newCookie = this.auth.createSessionCookie(request.session.id);

			response.cookie(newCookie.name, newCookie.value, newCookie.attributes);
		}

		next();
	}
}

export async function setupRequest(request: Request, auth: Auth) {
	return setupSessionContainer(request, auth, request.headers.authorization);
}

export async function setupSessionContainer(container: LuciaContainer, auth: Auth, token: string | undefined) {
	const sessionId = auth.readBearerToken(token ?? '');

	const { user, session } = await auth.validateSession(sessionId ?? '');

	container.user = user;
	container.session = session;
}

export * from './types';
