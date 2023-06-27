import type { Message, PrismaClient } from '$prisma-client';
import { Fixture, LinkMethod } from 'prisma-fixtures';
import UserFixture from './Users';

export default class MessageFixture extends Fixture<Message> {
	override dependencies = [UserFixture];

	override async seed(_prisma: PrismaClient, _link: LinkMethod<this>): Promise<Message[]> {
		// f.seed(123456789);

		// const messages = await upsertRange(prisma.message.upsert, 3, (current) => {
		// 	const text = f.word.words(4);
		// 	const userId = link(UserFixture, LinkMode.RANDOM).id;

		// 	return {
		// 		create: {
		// 			text,
		// 			userId,
		// 		},
		// 		update: {},
		// 		where: {
		// 			id: current,
		// 		},
		// 	};
		// });

		// return messages;
		return [];
	}
}
