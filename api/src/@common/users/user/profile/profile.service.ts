import { UserUpdateInput } from '$prisma-graphql/user';
import { PrismaSelector, PrismaService } from '$prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { User } from 'lucia';

@Injectable()
export class UserProfileService {
	constructor(private readonly prisma: PrismaService) {}

	async editUser(select: PrismaSelector, user: User, data: UserUpdateInput) {
		const updatedUser = await this.prisma.mutate(['USER_EDITED'], select, (allSelect) => {
			return this.prisma.user.update({
				where: {
					email: user.email,
				},
				data,
				...allSelect,
			});
		});

		return updatedUser;
	}
}
