import { getGraphQLRequest } from '$common/utils/contextExtracter';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const AuthSession = createParamDecorator(async (_data, context: ExecutionContext) => {
	const { session } = getGraphQLRequest(context);

	return session;
});
