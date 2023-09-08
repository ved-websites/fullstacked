import { ContextService } from '$graphql/context/context.service';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Session, User } from 'lucia';

export const AuthSession = createParamDecorator(async (_data, context: ExecutionContext) => {
	const { session } = ContextService.getRequest(context);

	return session;
});

export type LuciaSession = Session;
export type LuciaUser = User;
