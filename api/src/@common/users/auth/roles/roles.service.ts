import { User } from '$prisma-client';
import { PrismaService } from '$prisma/prisma.service';
import RoleCreateNestedManyWithoutUsersInputSchema from '$zod/inputTypeSchemas/RoleCreateNestedManyWithoutUsersInputSchema';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { z } from 'zod/v4';
import { Roles, rolesIntersect, specRolesMap } from '~shared';

@Injectable()
export class RolesService implements OnApplicationBootstrap {
	constructor(private readonly prisma: PrismaService) {}

	async onApplicationBootstrap() {
		const previousRoles = await this.prisma.role.findMany({ select: { text: true } });

		const upsertPromises = specRolesMap.map(async (spec) => {
			return this.prisma.role.upsert({
				create: {
					text: spec.name,
				},
				update: {},
				where: {
					text: spec.name,
				},
			});
		});

		await Promise.all(upsertPromises);

		const rolesToCheckForDeletion = previousRoles.map((r) => r.text);

		await Promise.all(
			rolesToCheckForDeletion.map(async (role) => {
				if (!specRolesMap.some((spec) => spec.name === role)) {
					await this.prisma.role.update({
						data: { users: { set: [] } },
						where: { text: role },
					});
					await this.prisma.role.delete({
						where: { text: role },
					});
				}
			}),
		);
	}

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

	async setUserRoles(user: Pick<User, 'email'>, roles: z.output<typeof RoleCreateNestedManyWithoutUsersInputSchema>) {
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

	async userCanSendEmail(user: Pick<User, 'email'>) {
		const rolesCanSendEmail = [Roles.ADMIN.name];

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

		return rolesIntersect(rolesCanSendEmail, userRoles);
	}
}
