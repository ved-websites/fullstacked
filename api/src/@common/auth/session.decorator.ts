import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import type { Request } from 'express';

export const AuthSession = createParamDecorator(async (_data, context: ExecutionContext) => {
	const { session } = context.switchToHttp().getRequest() as Request;

	return session;
});
