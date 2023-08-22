import { getRequest } from '$utils/contextExtracter';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Session } from 'lucia';

export const AuthSession = createParamDecorator(async (_data, context: ExecutionContext) => {
	const { session } = getRequest(context);

	return session;
});

export type LuciaSession = Session;
