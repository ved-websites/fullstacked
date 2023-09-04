import { RoleCreateNestedManyWithoutUsersInput, RoleWhereInput } from '$prisma-graphql/role';
import { PrismaSelector, PrismaService } from '$prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { User } from 'lucia';
import { ADMIN } from '~/@utils/roles';

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

	async setUserRoles(user: User, roles: RoleCreateNestedManyWithoutUsersInput) {
		const updatedUser = await this.prisma.mutate('USER_ROLE', {}, () => {
			return this.prisma.user.update({
				where: {
					email: user.email,
				},
				data: {
					roles,
				},
			});
		});

		return updatedUser;
	}

	rolesIntersect(roles1: string[], roles2: string[]) {
		return roles1.some((role1) => roles2.some((role2) => role2 === role1));
	}

	async userCanSendEmail(user: User) {
		const rolesCanSendEmail = [ADMIN];

		const userRoles = (
			await this.prisma.role.findMany({
				where: {
					users: {
						some: {
							email: user.email,
						},
					},
				},
				select: {
					text: true,
				},
			})
		).map((userRole) => userRole.text);

		return this.rolesIntersect(rolesCanSendEmail, userRoles);
	}
}
