import type { TypedWebSocket } from '$socket/types';
import { UserContainer } from '$users/auth/types';
import { ExecutionContext, Injectable } from '@nestjs/common';
import type { Request, Response } from 'express';

@Injectable()
export class ContextService {
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

	protected static getUserContainer(context: ExecutionContext): UserContainer {
		if (context.getType() === 'ws') {
			const socket = context.switchToWs().getClient<TypedWebSocket>();

			return socket;
		}

		const request = ContextService.getRequest(context);

		return request;
	}

	static getSession(context: ExecutionContext) {
		const { session } = this.getUserContainer(context);

		return session;
	}

	static getUser(context: ExecutionContext) {
		const { user } = this.getUserContainer(context);

		return user;
	}
}
