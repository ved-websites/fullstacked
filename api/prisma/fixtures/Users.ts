import type { PrismaClient, User } from '$prisma-client';
import { Fixture } from 'prisma-fixtures';

export default class UserFixture extends Fixture<User> {
	override dependencies = [];

	override async seed(_prisma: PrismaClient): Promise<User[]> {
		return [];
	}
}
