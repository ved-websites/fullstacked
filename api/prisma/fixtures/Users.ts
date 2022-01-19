import { PrismaClient, User } from '@prisma/client';
import { Fixture, upsertMany } from 'prisma-fixtures';

export default class UserFixture extends Fixture<User> {
	override dependencies = [];

	override async seed(prisma: PrismaClient): Promise<User[]> {
		const users = await upsertMany(prisma.user.upsert, {
			create: {
				username: 'V-ed',
				firstName: 'Guilaume',
				lastName: 'Marcoux',
			},
			update: {},
			where: {
				username: 'V-ed',
			},
		});

		return users;
	}
}
