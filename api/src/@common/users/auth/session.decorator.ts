import { ContextService } from '$context/context.service';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const AuthSession = createParamDecorator(async (_data, context: ExecutionContext) => {
	return ContextService.getSession(context);
});
export const AuthUser = createParamDecorator(async (_data, context: ExecutionContext) => {
	return ContextService.getUser(context);
});

export * from './types';
