import { ContextService } from '$graphql/context/context.service';
import { I18nService } from '$i18n/i18n.service';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private readonly i18n: I18nService,
	) {}

	async canActivate(context: ExecutionContext) {
		const isPublic = this.reflector.getAllAndOverride(Public, [context.getHandler(), context.getClass()]);

		if (isPublic) {
			return true;
		}

		const { session } = ContextService.getRequest(context);

		if (!session) {
			// Unauthorized == Unauthenticated
			throw new UnauthorizedException();
		}

		if (session.state !== 'active') {
			throw new UnauthorizedException(this.i18n.t('auth.errors.session.inactive'));
		}

		return true;
	}
}

/**
 * Mark this target as being Public (accessible without a session).
 *
 * Pass in any falsy value (except `undefined`) to disable this decorator at runtime.
 */
export const Public = Reflector.createDecorator<unknown, boolean>({ transform: (arg) => arg === undefined || !!arg });
