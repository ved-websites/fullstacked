import { getGraphQLRequest } from '$utils/contextExtracter';
import { CanActivate, ExecutionContext, Injectable, SetMetadata, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	async canActivate(context: ExecutionContext) {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);

		if (isPublic) {
			return true;
		}

		const { session } = getGraphQLRequest(context);

		if (!session) {
			// Unauthorized == Unauthenticated
			throw new UnauthorizedException();
		}

		if (session.state !== 'active') {
			throw new UnauthorizedException('Session is not active anymore!');
		}

		return true;
	}
}

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
