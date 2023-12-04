import { TypedI18nService } from '$i18n/i18n.service';
import { Auth, LuciaFactory } from '$users/auth/lucia/lucia.factory';
import { COOKIE_NAME, setupRequest } from '$users/auth/lucia/lucia.middleware';
import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { Request, Response } from 'express';
import { ConnectionInitMessage, Context } from 'graphql-ws';

export type TypedSubscriptionContext = Context<ConnectionInitMessage['payload'], { request?: Request }>;
export type CommonGQLContext = { req: Request; res: Response };

@Injectable()
export class ContextService {
	constructor(
		@Inject(LuciaFactory) private readonly auth: Auth,
		private readonly i18n: TypedI18nService,
	) {}

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

	extractRawGqlContext(context: TypedSubscriptionContext | CommonGQLContext) {
		if ('extra' in context && context?.extra?.request) {
			const req = context?.extra?.request;

			return { req, isExtra: true };
		}

		if (!('req' in context)) {
			throw this.i18n.t('common.errors.internal-server-error');
		}

		const req = context.req;

		return { req, res: context?.res, isExtra: false };
	}

	async setupGqlContext(context: TypedSubscriptionContext | CommonGQLContext) {
		const { req, res, isExtra } = this.extractRawGqlContext(context);

		if (isExtra) {
			const { connectionParams } = context as TypedSubscriptionContext;

			// Casting to workaround TS type narrowing
			if ('session' in (req as typeof req)) {
				return {
					req: {
						...req,
						headers: {
							...req.headers,
							...connectionParams,
						},
					},
				};
			}

			const cookies = this.parseCookies(req);

			const authSessionCookieToken = cookies[COOKIE_NAME];
			const authSessionHeader = connectionParams?.Authorization as string | undefined;

			req.headers.authorization ??= authSessionHeader ?? (authSessionCookieToken ? `Bearer ${authSessionCookieToken}` : undefined);

			await setupRequest(req, this.auth);

			return {
				req: {
					...req,
					headers: {
						...req.headers,
						...connectionParams,
					},
				},
			};
		}

		await setupRequest(req, this.auth);

		return { req, res };
	}

	static getGraphQLRequest(context: ExecutionContext) {
		const gqlContext = GqlExecutionContext.create(context);

		return gqlContext.getContext<CommonGQLContext>().req;
	}

	/**
	 * This function is used to get the request object from the given context, beit the GraphQL Request or the HTTP request.
	 */
	static getRequest(context: ExecutionContext) {
		if (context.getType() === 'http') {
			return context.switchToHttp().getRequest<Request>();
		}

		return this.getGraphQLRequest(context);
	}

	static getGraphQLResponse(context: ExecutionContext) {
		return this.getGraphQLRequest(context).res!;
	}

	static getResponse(context: ExecutionContext) {
		if (context.getType() === 'http') {
			return context.switchToHttp().getResponse<Response>();
		}

		return this.getGraphQLRequest(context).res!;
	}
}
