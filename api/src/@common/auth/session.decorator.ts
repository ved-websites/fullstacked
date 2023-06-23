import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { getLuciaAuthFromContext } from './lucia/lucia.decorator';

export const AuthSession = createParamDecorator(async (_data, ctx: ExecutionContext) => {
	const auth = getLuciaAuthFromContext(ctx);

	const session = await auth.validate();

	return session;
});
