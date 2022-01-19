import { Injectable } from '@nestjs/common';
import { PrismaSelect } from '@paljs/plugins';
import deepmerge from 'deepmerge';
import { GraphQLResolveInfo } from 'graphql';
import { PubSub as PubSubGraphQL } from 'graphql-subscriptions';

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

	prismaSubscribe(triggers: AsyncIteratorParamType, info: GraphQLResolveInfo, onUnsubscribe?: () => PromiseLike<void> | void) {
		const sub = this.asyncIterator(triggers);

		const select = new PrismaSelect(info).value;
		const fullTriggers = Array.isArray(triggers) ? triggers : [triggers];

		fullTriggers.forEach((trigger) => (this.eventSubsSelectors[trigger] = (this.eventSubsSelectors[trigger] ?? []).concat(select)));

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
		triggerName: PublishParamType,
		info: GraphQLResolveInfo,
		mutator: (allSelect: PrismaSelector) => PromiseLike<T> | T,
	) {
		const select = new PrismaSelect(info).value;

		const subscriberSelects = this.eventSubsSelectors[triggerName];

		const allSelect: PrismaSelector = subscriberSelects ? deepmerge.all([select, ...subscriberSelects]) : select;

		const returnValue = await mutator(allSelect);

		this.publish(triggerName, { [triggerName]: returnValue });

		return returnValue;
	}
}
