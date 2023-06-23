import type { Message, PrismaClient } from '$prisma-client';
import { Fixture, LinkMethod } from 'prisma-fixtures';
import UserFixture from './Users';

export default class MessageFixture extends Fixture<Message> {
	override dependencies = [UserFixture];

	override async seed(_prisma: PrismaClient, _link: LinkMethod<this>): Promise<Message[]> {
		// const messages = await createMany(
		// 	prisma.message.create,
		// 	{
		// 		text: 'First messages',
		// 		user: {
		// 			connect: {
		// 				email: 'email@mail.com',
		// 			},
		// 		},
		// 	},
		// 	(index) => ({
		// 		text: 'Hello!',
		// 		userId: link(UserFixture, index).id,
		// 	}),
		// );

		// return messages;

		return [];
	}
}
