import { User, UserCreateInput, UserUpdateInput, UserWhereInput, UserWhereUniqueInput } from '$prisma-graphql/user';
import { PrismaSelector } from '$prisma/prisma.service';
import { SelectQL } from '$prisma/select-ql.decorator';
import { Roles } from '$users/auth/roles/roles.guard';
import { AuthSession, LuciaSession } from '$users/auth/session.decorator';
import { Origin } from '$utils/origin.decorator';
import { ForbiddenException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ADMIN } from '~/@utils/roles';
import { AdminService } from './admin.service';
import { CreateUserOutput } from './dtos/create-user.output';
import { GetUserOutput } from './dtos/getUser.output';

@Roles(ADMIN)
@Resolver()
export class AdminResolver {
	constructor(private readonly adminService: AdminService) {}

	@Query(() => [User])
	async getUsers(@SelectQL() select: PrismaSelector, @Args('where', { nullable: true }) where?: UserWhereInput) {
		const users = await this.adminService.getUsers(select, where);

		return users;
	}

	@Query(() => GetUserOutput, { nullable: true })
	async getUser(@SelectQL() select: PrismaSelector, @Args('where') where: UserWhereInput) {
		const user = await this.adminService.getUser(select, where);

		return user;
	}

	@Mutation(() => CreateUserOutput)
	async createUser(@Args('data') data: UserCreateInput, @AuthSession() { user: originUser }: LuciaSession, @Origin() origin: string) {
		const user = await this.adminService.createUser(data, { origin, originUser });

		return user satisfies CreateUserOutput;
	}

	@Mutation(() => User)
	async editUser(@SelectQL() select: PrismaSelector, @Args('where') where: UserWhereUniqueInput, @Args('data') data: UserUpdateInput) {
		try {
			const user = await this.adminService.editUser(select, where, data);

			return user;
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Unhandled exception.';

			throw new ForbiddenException(message);
		}
	}

	@Mutation(() => GetUserOutput, { nullable: true })
	async deleteUser(@SelectQL() select: PrismaSelector, @Args('where') where: UserWhereUniqueInput) {
		try {
			const user = await this.adminService.deleteUser(select, where);

			return user;
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Unhandled exception.';

			throw new ForbiddenException(message);
		}
	}
}
