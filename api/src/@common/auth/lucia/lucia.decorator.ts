import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { Response } from 'express';
import type { AuthRequest } from 'lucia';
import type { Auth } from './lucia.factory';

export function getLuciaAuthFromContext(ctx: ExecutionContext) {
	const gqlContext = GqlExecutionContext.create(ctx);

	const response = gqlContext.getContext().req.res as Response;

	return response.locals.auth;
}

export const LuciaAuth = createParamDecorator((_data, ctx: ExecutionContext) => {
	return getLuciaAuthFromContext(ctx);
});

export type LuciaAuthRequest = AuthRequest<Auth>;
