import { Inject, Injectable, NestMiddleware, forwardRef } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { Auth, LuciaFactory } from './lucia.factory';

export const COOKIE_NAME = 'auth_session';

@Injectable()
export class LuciaMiddleware implements NestMiddleware {
	constructor(@Inject(forwardRef(() => LuciaFactory)) private readonly auth: Auth) {}

	async use(request: Request, response: Response, next: NextFunction) {
		const authSessionCookieToken = request.cookies[COOKIE_NAME] as string | undefined;
		const authSessionHeader = request.headers.authorization;

		if (authSessionCookieToken && !authSessionHeader) {
			request.headers.authorization = `Bearer ${authSessionCookieToken}`;
		}

		const requestAuth = this.auth.handleRequest(request, response);

		response.locals.auth = requestAuth;

		request.sessionId = this.auth.readBearerToken(request.headers.authorization);

		try {
			request.session = request.sessionId ? await this.auth.getSession(request.sessionId) : null;
		} catch (error) {
			// invalid session
			request.session = null;
		}

		next();
	}
}
