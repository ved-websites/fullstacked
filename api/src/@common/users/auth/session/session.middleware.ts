import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { SESSION_COOKIE_NAME } from '~shared';
import { UserContainer } from '../types';
import { SessionService } from './session.service';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
	constructor(private readonly sessionService: SessionService) {}

	async use(request: Request, response: Response, next: NextFunction) {
		const authSessionCookieToken = request.cookies?.[SESSION_COOKIE_NAME] as string | undefined;
		const authSessionHeader = request.headers.authorization;

		if (authSessionCookieToken && !authSessionHeader) {
			request.headers.authorization = `Bearer ${authSessionCookieToken}`;
		}

		const sessionToken = this.sessionService.readBearerToken(request.headers.authorization ?? '');

		const fresh = await this.setupSessionContainer(request, sessionToken);

		// Refresh cookie when required.
		if (request.session && fresh) {
			const newCookie = this.sessionService.createSessionCookie(sessionToken!);

			response.cookie(newCookie.name, newCookie.value, newCookie.options);
		}

		next();
	}

	async setupSessionContainer(container: UserContainer, sessionToken: string | null) {
		const { user, session, fresh } = await this.sessionService.validateSessionToken(sessionToken ?? '');

		container.user = user;
		container.session = session;

		return fresh;
	}
}
