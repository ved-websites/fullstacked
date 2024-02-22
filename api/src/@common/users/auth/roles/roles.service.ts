import { PrismaService } from '$prisma/prisma.service';
import RoleCreateNestedManyWithoutUsersInputSchema from '$zod/inputTypeSchemas/RoleCreateNestedManyWithoutUsersInputSchema';
import { Injectable } from '@nestjs/common';
import { User } from 'lucia';
import { z } from 'zod';
import { Roles } from '~utils/roles';

@Injectable()
export class RolesService {
	constructor(private readonly prisma: PrismaService) {}

	async getRoles() {
		const roles = await this.prisma.role.findMany();

		return roles;
	}

	async getRolesOfUser(email: string) {
		const roles = await this.prisma.role.findMany({
			where: {
				users: {
					some: {
						email,
					},
				},
			},
		});

		return roles;
	}

	async setUserRoles(user: User, roles: z.output<typeof RoleCreateNestedManyWithoutUsersInputSchema>) {
		const updatedUser = await this.prisma.user.update({
			where: {
				email: user.email,
			},
			data: {
				roles,
			},
			include: {
				roles: true,
			},
		});

		return updatedUser;
	}

	rolesIntersect(roles1: string[], roles2: string[]) {
		return roles1.some((role1) => roles2.some((role2) => role2 === role1));
	}

	async userCanSendEmail(user: User) {
		const rolesCanSendEmail = [Roles.ADMIN];

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
