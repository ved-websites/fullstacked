import { TypedI18nService } from '$i18n/i18n.service';
import type { TypedWebSocket } from '$socket/types';
import { Auth, LuciaFactory } from '$users/auth/lucia/lucia.factory';
import type { LuciaContainer } from '$users/auth/lucia/types';
import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import type { Request, Response } from 'express';

@Injectable()
export class ContextService {
	constructor(
		@Inject(LuciaFactory) private readonly auth: Auth,
		private readonly i18n: TypedI18nService,
	) {}

	/**
	 * This function is used to get the request object from the given context, beit the WS Request or the HTTP request.
	 */
	static getRequest(context: ExecutionContext) {
		if (context.getType() === 'http') {
			return context.switchToHttp().getRequest<Request>();
		}

		if (context.getType() === 'ws') {
			return {} as Request;
		}

		throw new Error('Request type not supported!');
	}

	static getResponse(context: ExecutionContext) {
		if (context.getType() === 'http') {
			return context.switchToHttp().getResponse<Response>();
		}

		if (context.getType() === 'ws') {
			return {} as Response;
		}

		throw new Error('Response type not supported!');
	}

	protected static getLuciaContainer(context: ExecutionContext): LuciaContainer {
		if (context.getType() === 'ws') {
			const socket = context.switchToWs().getClient<TypedWebSocket>();

			return socket;
		}

		const request = ContextService.getRequest(context);

		return request;
	}

	static getSession(context: ExecutionContext) {
		const { session } = this.getLuciaContainer(context);

		return session;
	}

	static getUser(context: ExecutionContext) {
		const { user } = this.getLuciaContainer(context);

		return user;
	}
}
