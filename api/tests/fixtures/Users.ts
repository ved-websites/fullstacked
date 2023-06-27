import type { PrismaClient, User } from '$prisma-client';
import { Fixture } from 'prisma-fixtures';

export default class UserFixture extends Fixture<User> {
	override dependencies = [];

	override async seed(_prisma: PrismaClient): Promise<User[]> {
		// f.seed(123456789);

		// const users = await upsertRange(prisma.user.upsert, 5, () => {
		// 	const id = f.string.alphanumeric({ length: 15 });
		// 	const email = f.internet.email();
		// 	const firstName = f.person.firstName();
		// 	const lastName = f.person.lastName();

		// 	return {
		// 		create: {
		// 			id,
		// 			email,
		// 			firstName,
		// 			lastName,
		// 		},
		// 		update: {},
		// 		where: {
		// 			email,
		// 		},
		// 	};
		// });

		// return users;
		return [];
	}
}
