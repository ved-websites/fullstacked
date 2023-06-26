import { ADMIN } from '$/@utils/roles';
import { Roles } from '$auth/roles/roles.guard';
import { User, UserUpdateWithoutMessagesInput, UserWhereInput, UserWhereUniqueInput } from '$prisma-graphql/user';
import { PrismaSelector } from '$prisma/prisma.service';
import { SelectQL } from '$prisma/select-ql.decorator';
import { ForbiddenException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GetUserOutput } from './dtos/getUser.output';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
	constructor(private readonly usersService: UsersService) {}

	@Roles(ADMIN)
	@Query(() => [User])
	async getUsers(@SelectQL() select: PrismaSelector, @Args('where', { nullable: true }) where?: UserWhereInput) {
		const users = await this.usersService.getUsers(select, where);

		return users;
	}

	@Roles(ADMIN)
	@Query(() => GetUserOutput, { nullable: true })
	async getUser(@SelectQL() select: PrismaSelector, @Args('where') where: UserWhereInput) {
		const user = await this.usersService.getUser(select, where);

		return user;
	}

	@Roles(ADMIN)
	@Mutation(() => User)
	async editUser(
		@SelectQL() select: PrismaSelector,
		@Args('where') where: UserWhereUniqueInput,
		@Args('data') data: UserUpdateWithoutMessagesInput,
	) {
		try {
			const user = await this.usersService.editUser(where, select, data);

			return user;
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Unhandled exception.';

			throw new ForbiddenException(message);
		}
	}
}
