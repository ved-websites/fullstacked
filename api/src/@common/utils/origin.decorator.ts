import { ContextService } from '$context/context.service';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const Origin = createParamDecorator(async (_data, context: ExecutionContext) => {
	const request = ContextService.getRequest(context);

	return request.headers.origin;
});
