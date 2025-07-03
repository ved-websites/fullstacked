import { ContextService } from '$context/context.service';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

/**
 * Decorator to get the session of the authenticated user from the request context.
 *
 * Type : `Session | null` (you could omit the `| null` if you are sure the session exists)
 */
export const AuthSession = createParamDecorator(async (_data, context: ExecutionContext) => {
	return ContextService.getSession(context);
});

/**
 * Decorator to get the authenticated user from the request context.
 *
 * Type : `AppUser | null`
 */
export const AuthUser = createParamDecorator(async (_data, context: ExecutionContext) => {
	return ContextService.getUser(context);
});

export * from '../types';
