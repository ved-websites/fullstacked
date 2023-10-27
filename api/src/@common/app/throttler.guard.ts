import { ContextService } from '$graphql/context/context.service';
import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { ThrottlerGuard as NestThrottlerGuard, ThrottlerOptions } from '@nestjs/throttler';
import { ThrottlerLimitDetail } from '@nestjs/throttler/dist/throttler.guard.interface';

export const throttlerConf: ThrottlerOptions[] = [
	{
		name: 'short',
		ttl: 3,
		limit: 30,
	},
	{
		name: 'long',
		ttl: 30,
		limit: 500,
	},
];

@Injectable()
export class ThrottlerGuard extends NestThrottlerGuard {
	override getRequestResponse(context: ExecutionContext) {
		const req = ContextService.getRequest(context);
		const res = ContextService.getResponse(context);

		return { req, res };
	}

	protected override async handleRequest(context: ExecutionContext, limit: number, ttl: number, throttler: ThrottlerOptions) {
		const res = ContextService.getResponse(context);

		if (!res) {
			// Do not restrict WebSockets / Subscriptions yet.
			return true;
		}

		return super.handleRequest(context, limit, ttl, throttler);
	}

	protected override async throwThrottlingException(context: ExecutionContext, _throttlerLimitDetail: ThrottlerLimitDetail): Promise<void> {
		const { i18nContext: i18n } = ContextService.getRequest(context);

		throw new ForbiddenException(i18n.t('common.errors.throttler.forbidden'));
	}
}
