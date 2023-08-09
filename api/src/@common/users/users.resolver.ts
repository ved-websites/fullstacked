import { Roles } from '$auth/roles/roles.guard';
import { AuthSession } from '$auth/session.decorator';
import { User, UserCreateInput, UserUpdateWithoutMessagesInput, UserWhereInput, UserWhereUniqueInput } from '$prisma-graphql/user';
import { PrismaSelector } from '$prisma/prisma.service';
import { SelectQL } from '$prisma/select-ql.decorator';
import { Origin } from '$utils/origin.decorator';
import { ForbiddenException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Session as LuciaSession } from 'lucia';
import { ADMIN } from '~/@utils/roles';
import { CreateUserOutput } from './dtos/create-user.output';
import { GetUserOutput } from './dtos/getUser.output';
import { UsersService } from './users.service';

@Roles(ADMIN)
@Resolver()
export class UsersResolver {
	constructor(private readonly usersService: UsersService) {}

	@Query(() => [User])
	async getUsers(@SelectQL() select: PrismaSelector, @Args('where', { nullable: true }) where?: UserWhereInput) {
		const users = await this.usersService.getUsers(select, where);

		return users;
	}

	@Query(() => GetUserOutput, { nullable: true })
	async getUser(@SelectQL() select: PrismaSelector, @Args('where') where: UserWhereInput) {
		const user = await this.usersService.getUser(select, where);

		return user;
	}

	@Mutation(() => CreateUserOutput)
	async createUser(@Args('data') data: UserCreateInput, @AuthSession() { user: originUser }: LuciaSession, @Origin() origin: string) {
		const user = await this.usersService.createUser(data, { origin, originUser });

		return user;
	}

	@Mutation(() => User)
	async editUser(
		@SelectQL() select: PrismaSelector,
		@Args('where') where: UserWhereUniqueInput,
		@Args('data') data: UserUpdateWithoutMessagesInput,
	) {
		try {
			const user = await this.usersService.editUser(select, where, data);

			return user;
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Unhandled exception.';

			throw new ForbiddenException(message);
		}
	}

	@Mutation(() => GetUserOutput, { nullable: true })
	async deleteUser(@SelectQL() select: PrismaSelector, @Args('where') where: UserWhereUniqueInput) {
		try {
			const user = await this.usersService.deleteUser(select, where);

			return user;
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Unhandled exception.';

			throw new ForbiddenException(message);
		}
	}
}
