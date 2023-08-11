import { PrismaClient } from '$prisma-client';
import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaSelect } from '@paljs/plugins';
import { PubSub } from 'graphql-subscriptions';
import { withCancel } from '../utils/withCancel';

export type AsyncIteratorParamType = Parameters<PubSub['asyncIterator']>[0];
export type PublishParamType = Parameters<PubSub['publish']>[0];

export type PrismaSelector = {
	[x: string]: never;
};

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
	private eventSubsSelectors: Record<string, unknown[] | undefined> = {};

	constructor(@Inject('PUB_SUB') private pubSub: PubSub) {
		super();
	}

	async onModuleInit(): Promise<void> {
		await this.$connect().catch((error) => {
			if (process.env.CI) {
				return;
			}

			throw error;
		});
	}

	async onModuleDestroy(): Promise<void> {
		await this.$disconnect();
	}

	async subscribe(triggers: AsyncIteratorParamType, select: PrismaSelector, onUnsubscribe?: () => PromiseLike<void> | void) {
		const fullTriggers = Array.isArray(triggers) ? triggers : [triggers];

		fullTriggers.forEach((trigger) => (this.eventSubsSelectors[trigger] = (this.eventSubsSelectors[trigger] ?? []).concat(select)));

		const sub = this.pubSub.asyncIterator(triggers);

		return withCancel(sub, () => {
			fullTriggers.forEach((trigger) => {
				this.eventSubsSelectors[trigger] = this.eventSubsSelectors[trigger]?.filter((selector) => selector != select);

				if (!this.eventSubsSelectors[trigger]?.length) {
					delete this.eventSubsSelectors[trigger];
				}
			});

			return onUnsubscribe?.();
		});
	}

	async mutate<T>(
		triggers: PublishParamType | PublishParamType[],
		select: PrismaSelector,
		mutator: (allSelect: PrismaSelector) => PromiseLike<T> | T,
	) {
		const fullTriggers = Array.isArray(triggers) ? triggers : [triggers];

		const subscriberSelects = fullTriggers
			.map((triggerName) => this.eventSubsSelectors[triggerName] ?? [])
			.reduce((acc, triggerSelector) => acc.concat(triggerSelector), []);

		const allSelect = PrismaSelect.mergeDeep(select, ...subscriberSelects);

		const returnValue = await mutator(allSelect);

		fullTriggers.forEach((triggerName) => this.pubSub.publish(triggerName, { [triggerName]: returnValue }));

		return returnValue;
	}
}
