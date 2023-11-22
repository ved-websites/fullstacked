import type {
	MessageCreateWithoutUserInput,
	MessageUpdateWithWhereUniqueWithoutUserInput,
	MessageWhereInput,
} from '$prisma-graphql/message';
import { PrismaSelector, PrismaService, PrismaSubscribeTriggers } from '$prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import type { User } from 'lucia';
import { MESSAGE_ADDED, MESSAGE_UPDATED } from './constants/triggers';

@Injectable()
export class MessageService {
	constructor(private readonly prisma: PrismaService) {}

	async find(select: PrismaSelector, where?: MessageWhereInput) {
		const messages = await this.prisma.message.findMany({ where, ...select });

		return messages;
	}

	async create(select: PrismaSelector, data: MessageCreateWithoutUserInput, user: User) {
		const message = await this.prisma.mutate([MESSAGE_ADDED], select, (allSelect) => {
			return this.prisma.message.create({
				data: {
					...data,
					user: { connect: { email: user.email } },
				},
				...allSelect,
			});
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

	subscribeAdded(select: PrismaSelector, triggers: PrismaSubscribeTriggers) {
		return this.prisma.subscribe(triggers, select);
	}
}
