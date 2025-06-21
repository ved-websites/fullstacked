import { ContextService } from '$context/context.service';
import { msDays, msSeconds } from '$utils/time';
import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { ThrottlerGuard as NestThrottlerGuard, Throttle, ThrottlerOptions } from '@nestjs/throttler';
import { ThrottlerLimitDetail } from '@nestjs/throttler/dist/throttler.guard.interface';

export const throttlerConf: ThrottlerOptions[] = [
	{
		name: 'short',
		ttl: msSeconds(3),
		limit: 30,
	},
	{
		name: 'long',
		ttl: msSeconds(30),
		limit: 500,
	},
];

export type ThrottlersConfiguration = Parameters<typeof Throttle>[0];

export const commonThrottlerConf = {
	sensitive: {
		short: { limit: 5, ttl: msSeconds(5) },
		long: { limit: 15, ttl: msSeconds(10) },
		daily: { limit: 100, ttl: msDays(1) },
	},
} satisfies Record<string, ThrottlersConfiguration>;

@Injectable()
export class ThrottlerGuard extends NestThrottlerGuard {
	override getRequestResponse(context: ExecutionContext) {
		const req = ContextService.getRequest(context);
		const res = ContextService.getResponse(context);

		return { req, res };
	}

	protected override async handleRequest(...args: Parameters<NestThrottlerGuard['handleRequest']>) {
		const [requestProps] = args;

		const res = ContextService.getResponse(requestProps.context);

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
