import { TypedI18nService } from '$i18n/i18n.service';
import { SocketService } from '$socket/socket.service';
import type { TypedWebSocket } from '$socket/types';
import { Auth, LuciaFactory } from '$users/auth/lucia/lucia.factory';
import { COOKIE_NAME, setupRequest } from '$users/auth/lucia/lucia.middleware';
import { parseCookies } from '$utils/cookies';
import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { Request, Response } from 'express';
import { ConnectionInitMessage, Context } from 'graphql-ws';

export type TypedSubscriptionContext = Context<ConnectionInitMessage['payload'], { request: Request }>;
export type CommonGQLContext = { req: Request; res: Response };

@Injectable()
export class ContextService {
	constructor(
		@Inject(LuciaFactory) private readonly auth: Auth,
		private readonly i18n: TypedI18nService,
	) {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	isSubscriptionContext(context: any): context is TypedSubscriptionContext {
		return 'extra' in context && !!context?.extra?.request;
	}

	extractRawGqlContext(context: TypedSubscriptionContext | CommonGQLContext) {
		if (this.isSubscriptionContext(context)) {
			const req = context.extra.request;

			return { req };
		}

		if (!('req' in context)) {
			throw this.i18n.t('common.errors.internal-server-error');
		}

		const req = context.req;

		return { req, res: context?.res };
	}

	async setupGqlContext(context: TypedSubscriptionContext | CommonGQLContext) {
		const { req, res } = this.extractRawGqlContext(context);

		if (this.isSubscriptionContext(context)) {
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

			const cookies = parseCookies(req.headers?.cookie);

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

	protected static getGraphQLRequest(context: ExecutionContext) {
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

		if (context.getType() === 'ws') {
			return {} as Request;
		}

		return this.getGraphQLRequest(context);
	}

	protected static getGraphQLResponse(context: ExecutionContext) {
		return this.getGraphQLRequest(context).res!;
	}

	static getResponse(context: ExecutionContext) {
		if (context.getType() === 'http') {
			return context.switchToHttp().getResponse<Response>();
		}

		if (context.getType() === 'ws') {
			return {} as Response;
		}

		return this.getGraphQLRequest(context).res!;
	}

	static async getSession(context: ExecutionContext) {
		if (context.getType() === 'ws') {
			const socket = context.switchToWs().getClient<TypedWebSocket>();

			await SocketService.finishInitialization(socket);

			return socket.session;
		}

		const request = ContextService.getRequest(context);

		return request.session;
	}

	static async getUser(context: ExecutionContext) {
		const session = await this.getSession(context);

		return session?.user;
	}
}
