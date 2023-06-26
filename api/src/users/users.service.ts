import { AuthService } from '$auth/auth.service';
import { RolesService } from '$auth/roles/roles.service';
import { UserCreateInput, UserUpdateWithoutMessagesInput, UserWhereInput, UserWhereUniqueInput } from '$prisma-graphql/user';
import { PrismaSelector, PrismaService } from '$prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly authService: AuthService,
		private readonly rolesService: RolesService,
	) {}

	async getUsers(select: PrismaSelector, where?: UserWhereInput) {
		const users = await this.prisma.user.findMany({
			where,
			...select,
			orderBy: {
				createdAt: 'asc',
			},
		});

		return users;
	}

	async getUser(select: PrismaSelector, where: UserWhereInput) {
		const users = await this.prisma.user.findFirst({
			where,
			...select,
		});

		return users;
	}

	async createUser(data: UserCreateInput) {
		const { email, firstName, lastName, roles } = data;

		const user = await this.authService.createUser(email, null, {
			firstName,
			lastName,
		});

		if (roles) {
			await this.rolesService.setUserRoles(user, roles);
		}

		return user;
	}

	async editUser(where: UserWhereUniqueInput, select: PrismaSelector, data: UserUpdateWithoutMessagesInput) {
		if (data.roles?.set?.every((role) => role.text != 'admin')) {
			// if no role has admin, check if at least one admin would remain
			const otherAdminsCount = await this.prisma.user.count({
				where: {
					email: {
						not: where.email,
					},
					roles: {
						some: {
							text: {
								equals: 'admin',
							},
						},
					},
				},
			});

			if (!otherAdminsCount) {
				throw new Error('Cannot remove the admin role on the last admin, make sure to define another user with the admin role first!');
			}
		}

		const updatedUser = await this.prisma.mutate(['USER_EDITED'], select, (allSelect) => {
			return this.prisma.user.update({ where, data, ...allSelect });
		});

		return updatedUser;
	}
}
