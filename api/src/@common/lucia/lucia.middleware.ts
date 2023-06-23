import { Inject, Injectable, NestMiddleware, forwardRef } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { Auth, LuciaFactory } from './lucia.factory';

@Injectable()
export class LuciaMiddleware implements NestMiddleware {
	constructor(@Inject(forwardRef(() => LuciaFactory)) private readonly auth: Auth) {}

	use(request: Request, response: Response, next: NextFunction) {
		const authSessionCookie = request.cookies.auth_session as string | undefined;
		const authSessionHeader = request.headers.authorization;

		if (authSessionCookie && !authSessionHeader) {
			request.headers.authorization = `Bearer ${authSessionCookie}`;
		}

		const requestAuth = this.auth.handleRequest(request, response);

		response.locals.auth = requestAuth;

		next();
	}
}
