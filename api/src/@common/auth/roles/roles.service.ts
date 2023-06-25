import { RoleWhereInput } from '$prisma-graphql/role';
import { PrismaSelector, PrismaService } from '$prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RolesService {
	constructor(private readonly prisma: PrismaService) {}

	async getRoles(select: PrismaSelector, where?: RoleWhereInput) {
		const roles = await this.prisma.role.findMany({
			where,
			...select,
		});

		return roles;
	}
}
