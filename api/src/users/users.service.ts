import { UserUpdateWithoutMessagesInput, UserWhereInput, UserWhereUniqueInput } from '$prisma-graphql/user';
import { PrismaSelector, PrismaService } from '$prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	async getUsers(select: PrismaSelector, where?: UserWhereInput) {
		const users = await this.prisma.user.findMany({
			where,
			...select,
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
