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
		const updatedMessage = await this.prisma.mutate(['USER_EDITED'], select, (allSelect) => {
			return this.prisma.user.update({ where, data, ...allSelect });
		});

		return updatedMessage;
	}
}
