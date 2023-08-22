import type { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { Request, Response } from 'express';

export function getGraphQLRequest(context: ExecutionContext) {
	const gqlContext = GqlExecutionContext.create(context);

	return gqlContext.getContext().req as Request;
}

/**
 * This function is used to get the request object from the given context, beit the GraphQL Request or the HTTP request.
 */
export function getRequest(context: ExecutionContext) {
	if (context.getType() === 'http') {
		return context.switchToHttp().getRequest<Request>();
	}

	const gqlContext = GqlExecutionContext.create(context);

	return gqlContext.getContext().req as Request;
}

export function getGraphQLResponse(context: ExecutionContext) {
	return getGraphQLRequest(context).res as Response;
}

export function getResponse(context: ExecutionContext) {
	const type = context.getType();

	if (context.getType() === 'http') {
		return context.switchToHttp().getResponse<Response>();
	}

	return getGraphQLRequest(context).res as Response;
}
