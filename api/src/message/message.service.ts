import { PrismaSelector, PrismaService } from '$common/prisma/prisma.service';
import type { MessageCreateInput, MessageUpdateWithWhereUniqueWithoutUserInput, MessageWhereInput } from '$prisma-graphql/message';
import { Injectable } from '@nestjs/common';
import { MESSAGE_ADDED, MESSAGE_UPDATED } from './constants/triggers';

@Injectable()
export class MessageService {
	constructor(private readonly prisma: PrismaService) {}

	async find(select: PrismaSelector, where?: MessageWhereInput) {
		const messages = await this.prisma.message.findMany({ where, ...select });

		return messages;
	}

	async create(select: PrismaSelector, data: MessageCreateInput) {
		const message = await this.prisma.mutate([MESSAGE_ADDED], select, (allSelect) => {
			return this.prisma.message.create({ data, ...allSelect });
		});

		return message;
	}

	async update(select: PrismaSelector, query: MessageUpdateWithWhereUniqueWithoutUserInput) {
		const where = query.where;
		const data = { time: new Date(), ...query.data };

		const updatedMessage = await this.prisma.mutate([MESSAGE_UPDATED], select, (allSelect) => {
			return this.prisma.message.update({ where, data, ...allSelect });
		});

		return updatedMessage;
	}

	subscribeAdded(select: PrismaSelector, triggers: Parameters<PrismaService['subscribe']>[0]) {
		return this.prisma.subscribe(triggers, select);
	}
}
