import { Public } from '$auth/auth.guard';
import { LuciaAuth, LuciaAuthRequest } from '$auth/lucia/lucia.decorator';
import { Roles } from '$auth/roles/roles.guard';
import { AuthSession } from '$auth/session.decorator';
import { Session } from '$prisma-graphql/session';
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
import { RegisterInput } from './dtos/register.input';
import { UnregisteredUserOutput } from './dtos/unregistered-user.output';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
	constructor(private readonly usersService: UsersService) {}

	@Public()
	@Mutation(() => Session)
	async register(@LuciaAuth() authRequest: LuciaAuthRequest, @Args('data') data: RegisterInput) {
		const session = await this.usersService.register(data);

		authRequest.setSession(session);

		return session;
	}

	@Public()
	@Query(() => UnregisteredUserOutput)
	async getUnregisteredUser(@Args('registerToken') registerToken: string) {
		const user = await this.usersService.getUnregisteredUser(registerToken);

		return user;
	}

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
	@Mutation(() => CreateUserOutput)
	async createUser(@Args('data') data: UserCreateInput, @AuthSession() { user: originUser }: LuciaSession, @Origin() origin: string) {
		const user = await this.usersService.createUser(data, { origin, originUser });

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
			const user = await this.usersService.editUser(select, where, data);

			return user;
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Unhandled exception.';

			throw new ForbiddenException(message);
		}
	}

	@Roles(ADMIN)
	@Mutation(() => GetUserOutput, { nullable: true })
	async deleteUser(@SelectQL() select: PrismaSelector, @Args('where') where: UserWhereUniqueInput) {
		const user = await this.usersService.deleteUser(select, where);

		return user;
	}
}
