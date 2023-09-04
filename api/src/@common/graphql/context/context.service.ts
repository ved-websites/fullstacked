import { Auth, LuciaFactory } from '$users/auth/lucia/lucia.factory';
import { COOKIE_NAME, setupRequest } from '$users/auth/lucia/lucia.middleware';
import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { Request, Response } from 'express';
import { ConnectionInitMessage, Context } from 'graphql-ws';

export type TypedSubscriptionContext = Context<ConnectionInitMessage['payload'], { request?: Request }>;
export type CommonContext = { req: Request; res: Response };

@Injectable()
export class ContextService {
	constructor(@Inject(LuciaFactory) private readonly auth: Auth) {}

	parseCookies(request: Request) {
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

	async setupGqlContext(context: TypedSubscriptionContext | CommonContext) {
		if ('extra' in context && context?.extra?.request) {
			const request = context?.extra?.request;

			const cookies = this.parseCookies(request);

			const authSessionCookieToken = cookies[COOKIE_NAME];
			const authSessionHeader = context.connectionParams?.Authorization as string | undefined;

			request.headers.authorization ??= authSessionHeader ?? (authSessionCookieToken ? `Bearer ${authSessionCookieToken}` : undefined);

			await setupRequest(request, this.auth);

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

		const req = context?.req;

		if (req) {
			await setupRequest(req, this.auth);
		}

		return { req, res: context?.res };
	}

	static getGraphQLRequest(context: ExecutionContext) {
		const gqlContext = GqlExecutionContext.create(context);

		return gqlContext.getContext().req as Request;
	}

	/**
	 * This function is used to get the request object from the given context, beit the GraphQL Request or the HTTP request.
	 */
	static getRequest(context: ExecutionContext) {
		if (context.getType() === 'http') {
			return context.switchToHttp().getRequest<Request>();
		}

		const gqlContext = GqlExecutionContext.create(context);

		return gqlContext.getContext().req as Request;
	}

	static getGraphQLResponse(context: ExecutionContext) {
		return this.getGraphQLRequest(context).res as Response;
	}

	static getResponse(context: ExecutionContext) {
		if (context.getType() === 'http') {
			return context.switchToHttp().getResponse<Response>();
		}

		return this.getGraphQLRequest(context).res as Response;
	}
}
