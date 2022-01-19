import { Message, PrismaClient } from '@prisma/client';
import f from 'faker';
import { Fixture, LinkMethod, LinkMode, upsertRange } from 'prisma-fixtures';
import UserFixture from './Users';

export default class MessageFixture extends Fixture<Message> {
	override dependencies = [UserFixture];

	override async seed(prisma: PrismaClient, link: LinkMethod<this>): Promise<Message[]> {
		f.seed(123456789);

		const messages = await upsertRange(prisma.message.upsert, 3, (current) => {
			const text = f.random.words(4);
			const userId = link(UserFixture, LinkMode.RANDOM).id;

			return {
				create: {
					text,
					userId,
				},
				update: {},
				where: {
					id: current,
				},
			};
		});

		return messages;
	}
}
