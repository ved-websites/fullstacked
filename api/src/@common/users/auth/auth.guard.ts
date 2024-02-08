import { ContextService } from '$context/context.service';
import { TypedI18nService } from '$i18n/i18n.service';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private readonly i18n: TypedI18nService,
	) {}

	async canActivate(context: ExecutionContext) {
		const isPublic = this.reflector.getAllAndOverride(Public, [context.getHandler(), context.getClass()]);

		if (isPublic) {
			return true;
		}

		const session = await ContextService.getSession(context);

		if (!session) {
			if (context.getType() === 'ws') {
				throw new WsException(this.i18n.t('auth.errors.session.missing'));
			}

			// Unauthorized == Unauthenticated
			throw new UnauthorizedException(this.i18n.t('auth.errors.session.missing'));
		}

		return true;
	}
}

/**
 * Mark this target as being Public (accessible without a session).
 *
 * Pass in any falsy value (except `undefined`) to disable this decorator at runtime.
 */
export const Public = Reflector.createDecorator<unknown, boolean>({ transform: (arg = true) => !!arg });
