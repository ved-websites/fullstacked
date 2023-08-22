import { getRequest } from '$utils/contextExtracter';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const Origin = createParamDecorator(async (_data, context: ExecutionContext) => {
	const request = getRequest(context);

	return request.headers.origin;
});
