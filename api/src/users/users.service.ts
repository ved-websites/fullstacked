import { UserWhereInput } from '$prisma-graphql/user';
import { PrismaSelector, PrismaService } from '$prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	async getUsers(select: PrismaSelector, where: UserWhereInput) {
		const users = await this.prisma.user.findMany({
			where,
			...select,
		});

		return users;
	}
}
