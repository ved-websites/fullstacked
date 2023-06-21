import { Inject, Injectable, type NestMiddleware } from '@nestjs/common';
import { AuthFactory, type Auth } from './lucia.module';

import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
	constructor(@Inject(AuthFactory) private readonly auth: Auth) {}

	use(request: Request, response: Response, next: NextFunction) {
		const requestAuth = this.auth.handleRequest(request, response);

		response.locals.auth = requestAuth;

		next();
	}
}
