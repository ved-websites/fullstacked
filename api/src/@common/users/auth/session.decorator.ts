import { ContextService } from '$context/context.service';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Session, User } from 'lucia';

export const AuthSession = createParamDecorator(async (_data, context: ExecutionContext) => {
	return ContextService.getSession(context);
});
export const AuthUser = createParamDecorator(async (_data, context: ExecutionContext) => {
	return ContextService.getUser(context);
});

export type LuciaSession = Session;
export type LuciaUser = User;
