import { Injectable } from '@nestjs/common';
import { PrismaSelect } from '@paljs/plugins';
import type { GraphQLResolveInfo } from 'graphql';
import { PubSub as PubSubGraphQL } from 'graphql-subscriptions';
import { getPrismaSelector } from './prisma.service';

export function withCancel<T>(
	asyncIterator: AsyncIterator<T | undefined>,
	onCancel: () => PromiseLike<void> | void,
): AsyncIterator<T | undefined> {
	if (!asyncIterator.return) {
		asyncIterator.return = () => Promise.resolve({ value: undefined, done: true });
	}

	const savedReturn = asyncIterator.return.bind(asyncIterator);

	asyncIterator.return = async () => {
		await onCancel();
		return savedReturn();
	};

	return asyncIterator;
}

type AsyncIteratorParamType = Parameters<PubSubGraphQL['asyncIterator']>[0];
type PublishParamType = Parameters<PubSubGraphQL['publish']>[0];

type PrismaSelector = Record<string, unknown>;

@Injectable()
export class PubSub extends PubSubGraphQL {
	eventSubsSelectors: Record<string, unknown[] | undefined> = {};

	async prismaSubscribe(triggers: AsyncIteratorParamType, info: GraphQLResolveInfo, onUnsubscribe?: () => PromiseLike<void> | void) {
		const select = await getPrismaSelector(info);

		const fullTriggers = Array.isArray(triggers) ? triggers : [triggers];

		fullTriggers.forEach((trigger) => (this.eventSubsSelectors[trigger] = (this.eventSubsSelectors[trigger] ?? []).concat(select)));

		const sub = this.asyncIterator(triggers);

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

	async prismaMutate<T>(
		triggers: PublishParamType | PublishParamType[],
		info: GraphQLResolveInfo,
		mutator: (allSelect: PrismaSelector) => PromiseLike<T> | T,
	) {
		const select = await getPrismaSelector(info);

		const fullTriggers = Array.isArray(triggers) ? triggers : [triggers];

		const subscriberSelects = fullTriggers
			.map((triggerName) => this.eventSubsSelectors[triggerName] ?? [])
			.reduce((acc, triggerSelector) => acc.concat(triggerSelector), []);

		const allSelect = PrismaSelect.mergeDeep(select, ...subscriberSelects);

		const returnValue = await mutator(allSelect);

		fullTriggers.forEach((triggerName) => this.publish(triggerName, { [triggerName]: returnValue }));

		return returnValue;
	}
}
