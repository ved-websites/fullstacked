import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { Auth, LuciaFactory } from './lucia.factory';

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
	request.sessionId = auth.readBearerToken(request.headers.authorization);

	try {
		request.session = request.sessionId ? await auth.validateSession(request.sessionId) : null;
	} catch (error) {
		// invalid session
		request.session = null;
	}

	return request.session;
}
