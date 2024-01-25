import { ContextService } from '$context/context.service';
import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { ThrottlerGuard as NestThrottlerGuard, Throttle, ThrottlerOptions } from '@nestjs/throttler';
import { ThrottlerLimitDetail } from '@nestjs/throttler/dist/throttler.guard.interface';

// limits here are transformed in seconds automatically
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

export const sensitiveThrottlerConf: Parameters<typeof Throttle> = [{ short: { limit: 5, ttl: 5000 }, long: { limit: 15, ttl: 10000 } }];

@Injectable()
export class ThrottlerGuard extends NestThrottlerGuard {
	override getRequestResponse(context: ExecutionContext) {
		const req = ContextService.getRequest(context);
		const res = ContextService.getResponse(context);

		return { req, res };
	}

	protected override async handleRequest(...args: Parameters<NestThrottlerGuard['handleRequest']>) {
		const [context] = args;

		const res = ContextService.getResponse(context);

		if (!res) {
			// Do not restrict WebSockets / Subscriptions yet.
			return true;
		}

		return super.handleRequest(...args);
	}

	protected override async throwThrottlingException(context: ExecutionContext, _throttlerLimitDetail: ThrottlerLimitDetail): Promise<void> {
		const { i18nContext: i18n } = ContextService.getRequest(context);

		throw new ForbiddenException(i18n.t('common.errors.throttler.forbidden'));
	}
}
