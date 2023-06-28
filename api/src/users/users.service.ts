import { AuthService } from '$auth/auth.service';
import { RolesService } from '$auth/roles/roles.service';
import { UserCreateInput, UserUpdateWithoutMessagesInput, UserWhereInput, UserWhereUniqueInput } from '$prisma-graphql/user';
import { PrismaSelector, PrismaService } from '$prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { RegisterInput } from './dtos/register.input';

@Injectable()
export class UsersService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly authService: AuthService,
		private readonly rolesService: RolesService,
	) {}

	async register({ registerToken, password, ...attributes }: RegisterInput) {
		const session = await this.authService.register(registerToken, password, attributes);

		return session;
	}

	async getUnregisteredUser(registerToken: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				registerToken,
			},
			select: {
				email: true,
				firstName: true,
				lastName: true,
			},
		});

		if (!user) {
			throw new Error('Invalid registration token!');
		}

		return user;
	}

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

	async editUser(select: PrismaSelector, where: UserWhereUniqueInput, data: UserUpdateWithoutMessagesInput) {
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

	async deleteUser(select: PrismaSelector, where: UserWhereUniqueInput) {
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
			throw new Error('Cannot delete the last admin user, make sure to define another user with the admin role first!');
		}

		const deletedUser = await this.prisma.user.delete({
			where,
			...select,
		});

		return deletedUser;
	}
}
