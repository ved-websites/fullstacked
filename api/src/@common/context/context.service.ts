import { TypedI18nService } from '$i18n/i18n.service';
import { SocketService } from '$socket/socket.service';
import type { TypedWebSocket } from '$socket/types';
import { Auth, LuciaFactory } from '$users/auth/lucia/lucia.factory';
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
