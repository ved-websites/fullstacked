import type { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { Request, Response } from 'express';

export function getGraphQLRequest(context: ExecutionContext) {
	const gqlContext = GqlExecutionContext.create(context);

	return gqlContext.getContext().req as Request;
}

export function getGraphQLResponse(context: ExecutionContext) {
	return getGraphQLRequest(context).res as Response;
}
