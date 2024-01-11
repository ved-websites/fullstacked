import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { Auth, LuciaFactory } from './lucia.factory';
import { SessionContainer } from './types';

export const COOKIE_NAME = 'auth_session';

@Injectable()
export class LuciaMiddleware implements NestMiddleware {
	constructor(@Inject(LuciaFactory) private readonly auth: Auth) {}

	async use(request: Request, response: Response, next: NextFunction) {
		const authSessionCookieToken = request.cookies?.[COOKIE_NAME] as string | undefined;
		const authSessionHeader = request.headers.authorization;

		if (authSessionCookieToken && !authSessionHeader) {
			request.headers.authorization = `Bearer ${authSessionCookieToken}`;
		}

		const authRequest = this.auth.handleRequest(request, response);

		response.locals.authRequest = authRequest;

		await setupRequest(request, this.auth);

		next();
	}
}

export async function setupRequest(request: Request, auth: Auth) {
	return setupSessionContainer(request, auth, request.headers.authorization);
}

export async function setupSessionContainer(container: SessionContainer, auth: Auth, token: string | undefined) {
	container.sessionId = auth.readBearerToken(token);

	try {
		container.session = container.sessionId ? await auth.validateSession(container.sessionId) : null;
	} catch (error) {
		// invalid session
		container.session = null;
	}

	return container.session;
}

export * from './types';
