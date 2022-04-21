import type { PrismaClient, User } from '$prisma-client';
import { faker as f } from '@faker-js/faker';
import { Fixture, upsertRange } from 'prisma-fixtures';

export default class UserFixture extends Fixture<User> {
	override dependencies = [];

	override async seed(prisma: PrismaClient): Promise<User[]> {
		f.seed(123456789);

		const users = await upsertRange(prisma.user.upsert, 5, () => {
			const username = f.unique(f.internet.userName);
			const firstName = f.name.firstName();
			const lastName = f.name.lastName();

			return {
				create: {
					username,
					firstName,
					lastName,
				},
				update: {},
				where: {
					username,
				},
			};
		});

		return users;
	}
}
