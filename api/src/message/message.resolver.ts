import { AuthSession } from '$common/auth/session.decorator';
import type { PrismaSelector } from '$common/prisma/prisma.service';
import { SelectQL } from '$common/prisma/select-ql.decorator';
import {
	Message,
	MessageCreateWithoutUserInput,
	MessageUpdateWithWhereUniqueWithoutUserInput,
	MessageWhereInput,
} from '$prisma-graphql/message';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import type { Session } from 'lucia';
import { MESSAGE_ADDED } from './constants/triggers';
import { MessageService } from './message.service';

@Resolver(() => Message)
export class MessageResolver {
	constructor(private messageService: MessageService) {}

	@Query(() => [Message])
	messages(@SelectQL() select: PrismaSelector, @Args('where', { nullable: true }) where: MessageWhereInput) {
		return this.messageService.find(select, where);
	}

	@Mutation(() => Message, { nullable: true })
	addMessage(@AuthSession() { user }: Session, @SelectQL() select: PrismaSelector, @Args('data') data: MessageCreateWithoutUserInput) {
		return this.messageService.create(select, data, user);
	}

	@Mutation(() => Message)
	updateMessage(@SelectQL() select: PrismaSelector, @Args('query') query: MessageUpdateWithWhereUniqueWithoutUserInput) {
		return this.messageService.update(select, query);
	}

	@Subscription(() => Message, {
		name: MESSAGE_ADDED,
		filter: (payload: { [MESSAGE_ADDED]: Message }, variables: { where?: MessageWhereInput }) => {
			return !variables.where?.text?.startsWith || payload[MESSAGE_ADDED].text.startsWith(variables.where.text.startsWith);
		},
	})
	subscribeMessageAdded(@SelectQL() select: PrismaSelector, @Args('where', { nullable: true }) _where: MessageWhereInput) {
		return this.messageService.subscribeAdded(select, MESSAGE_ADDED);
	}
}
