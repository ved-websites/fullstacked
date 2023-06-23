import type { PrismaClient, User } from '$prisma-client';
import { faker as f } from '@faker-js/faker';
import { Fixture, upsertRange } from 'prisma-fixtures';

export default class UserFixture extends Fixture<User> {
	override dependencies = [];

	override async seed(prisma: PrismaClient): Promise<User[]> {
		f.seed(123456789);

		const users = await upsertRange(prisma.user.upsert, 5, () => {
			const id = f.string.alphanumeric({ length: 15 });
			const email = f.internet.email();
			const firstName = f.person.firstName();
			const lastName = f.person.lastName();

			return {
				create: {
					id,
					email,
					firstName,
					lastName,
				},
				update: {},
				where: {
					email,
				},
			};
		});

		return users;
	}
}
