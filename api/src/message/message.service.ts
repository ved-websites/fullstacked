import { getPrismaSelector, PrismaService } from '$common/prisma/prisma.service';
import { PubSub } from '$common/prisma/pub-sub';
import type { MessageCreateInput, MessageUpdateWithWhereUniqueWithoutUserInput, MessageWhereInput } from '$prisma-graphql/message';
import { Injectable } from '@nestjs/common';
import type { GraphQLResolveInfo } from 'graphql';
import { MESSAGE_ADDED } from './constants/triggers';

@Injectable()
export class MessageService {
	constructor(private readonly prisma: PrismaService, private pubSub: PubSub) {}

	async find(info: GraphQLResolveInfo, where?: MessageWhereInput) {
		const messages = await this.prisma.message.findMany({ where, ...getPrismaSelector(info) });

		return messages;
	}

	async create(info: GraphQLResolveInfo, data: MessageCreateInput) {
		const message = await this.pubSub.prismaMutate([MESSAGE_ADDED], info, (allSelect) => {
			return this.prisma.message.create({ data, ...allSelect });
		});

		return message;
	}

	async update(info: GraphQLResolveInfo, query: MessageUpdateWithWhereUniqueWithoutUserInput) {
		const where = query.where;
		const data = { time: new Date(), ...query.data };

		const updatedMessage = await this.prisma.message.update({ where, data, ...getPrismaSelector(info) });

		return updatedMessage;
	}

	subscribeAdded(info: GraphQLResolveInfo, triggers: Parameters<MessageService['pubSub']['prismaSubscribe']>[0]) {
		return this.pubSub.prismaSubscribe(triggers, info);
	}
}
