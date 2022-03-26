import { Message, MessageCreateInput, MessageUpdateWithWhereUniqueWithoutUserInput, MessageWhereInput } from '$prisma-graphql/message';
import { Args, Info, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import type { GraphQLResolveInfo } from 'graphql';
import { MESSAGE_ADDED } from './constants/triggers';
import { MessageService } from './message.service';

@Resolver(() => Message)
export class MessageResolver {
	constructor(private messageService: MessageService) {}

	@Query(() => [Message])
	messages(@Info() info: GraphQLResolveInfo, @Args('where', { nullable: true }) where: MessageWhereInput) {
		return this.messageService.find(info, where);
	}

	@Mutation(() => Message, { nullable: true })
	addMessage(@Info() info: GraphQLResolveInfo, @Args('data') data: MessageCreateInput) {
		return this.messageService.create(info, data);
	}

	@Mutation(() => Message)
	updateMessage(@Info() info: GraphQLResolveInfo, @Args('query') query: MessageUpdateWithWhereUniqueWithoutUserInput) {
		return this.messageService.update(info, query);
	}

	@Subscription(() => Message, { name: MESSAGE_ADDED })
	subscribeMessageAdded(@Info() info: GraphQLResolveInfo) {
		return this.messageService.subscribeAdded(info);
	}
}
