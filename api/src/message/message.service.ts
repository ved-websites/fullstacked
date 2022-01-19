import { PrismaService } from '$common/prisma/prisma.service';
import { PubSub } from '$common/prisma/pub-sub';
import { MessageCreateInput, MessageUpdateWithWhereUniqueWithoutUserInput, MessageWhereInput } from '$prisma-graphql/message';
import { Injectable } from '@nestjs/common';
import { PrismaSelect } from '@paljs/plugins';
import { GraphQLResolveInfo } from 'graphql';

@Injectable()
export class MessageService {
	constructor(private readonly prisma: PrismaService, private pubSub: PubSub) {}

	async find(info: GraphQLResolveInfo, where?: MessageWhereInput) {
		const select = new PrismaSelect(info).value;

		const messages = await this.prisma.message.findMany({ where, ...select });

		return messages;
	}

	async create(info: GraphQLResolveInfo, data: MessageCreateInput) {
		const message = await this.pubSub.prismaMutate('messageAdded', info, (allSelect) => {
			return this.prisma.message.create({ data, ...allSelect });
		});

		return message;
	}

	async update(info: GraphQLResolveInfo, query: MessageUpdateWithWhereUniqueWithoutUserInput) {
		const select = new PrismaSelect(info).value;

		const where = query.where;
		const data = { time: new Date(), ...query.data };

		const updatedMessage = await this.prisma.message.update({ where, data, ...select });

		return updatedMessage;
	}

	subscribeAdded(info: GraphQLResolveInfo) {
		return this.pubSub.prismaSubscribe('messageAdded', info);
	}
}
