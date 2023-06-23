import { getLuciaAuthFromContext } from '$common/lucia/lucia.decorator';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const AuthSession = createParamDecorator(async (_data, ctx: ExecutionContext) => {
	const auth = getLuciaAuthFromContext(ctx);

	const session = await auth.validate();

	return session;
});
