import type { PrismaClient, User } from '$prisma-client';
import { Fixture, upsertMany } from 'prisma-fixtures';

export default class UserFixture extends Fixture<User> {
	override dependencies = [];

	override async seed(prisma: PrismaClient): Promise<User[]> {
		const users = await upsertMany(prisma.user.upsert, {
			create: {
				id: 'adawdad',
				email: 'email@mail.com',
				firstName: 'Guilaume',
				lastName: 'Marcoux',
			},
			update: {},
			where: {
				email: 'email@mail.com',
			},
		});

		return users;
	}
}
