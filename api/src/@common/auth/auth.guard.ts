import { getLuciaAuthFromContext } from '$common/lucia/lucia.decorator';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
	async canActivate(context: ExecutionContext) {
		const auth = getLuciaAuthFromContext(context);

		const session = await auth.validateBearerToken();

		return session != null;
	}
}
