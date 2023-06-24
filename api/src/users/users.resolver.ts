import { ADMIN } from '$/@utils/roles';
import { Roles } from '$auth/roles/roles.guard';
import { User, UserWhereInput } from '$prisma-graphql/user';
import { PrismaSelector } from '$prisma/prisma.service';
import { SelectQL } from '$prisma/select-ql.decorator';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
	constructor(private readonly usersService: UsersService) {}

	@Roles(ADMIN)
	@Query(() => [User])
	async getUsers(@SelectQL() select: PrismaSelector, @Args('where', { nullable: true }) where: UserWhereInput) {
		const users = await this.usersService.getUsers(select, where);

		return users;
	}
}
