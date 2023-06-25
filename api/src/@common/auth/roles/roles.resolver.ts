import { Role, RoleWhereInput } from '$prisma-graphql/role';
import { PrismaSelector } from '$prisma/prisma.service';
import { SelectQL } from '$prisma/select-ql.decorator';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { RolesService } from './roles.service';

@Resolver(() => Role)
export class RolesResolver {
	constructor(private readonly rolesService: RolesService) {}

	@Query(() => [Role])
	async getRoles(@SelectQL() select: PrismaSelector, @Args('where', { nullable: true }) where?: RoleWhereInput) {
		const roles = await this.rolesService.getRoles(select, where);

		return roles;
	}
}
