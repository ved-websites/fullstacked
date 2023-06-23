import { getGraphQLResponse } from '$common/utils/contextExtracter';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import type { AuthRequest } from 'lucia';
import type { Auth } from './lucia.factory';

export function getLuciaAuthFromContext(context: ExecutionContext) {
	const response = getGraphQLResponse(context);

	return response.locals.auth;
}

export const LuciaAuth = createParamDecorator((_data, context: ExecutionContext) => {
	return getLuciaAuthFromContext(context);
});

export type LuciaAuthRequest = AuthRequest<Auth>;
