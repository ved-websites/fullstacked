import { AuthSession, LuciaSession } from '$auth/session.decorator';
import { User, UserUpdateInput } from '$prisma-graphql/user';
import { PrismaSelector } from '$prisma/prisma.service';
import { SelectQL } from '$prisma/select-ql.decorator';
import { ForbiddenException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SettingsService } from './settings.service';

@Resolver()
export class SettingsResolver {
	constructor(private readonly settingsService: SettingsService) {}

	@Mutation(() => User)
	async editUserSettings(@SelectQL() select: PrismaSelector, @Args('data') data: UserUpdateInput, @AuthSession() { user }: LuciaSession) {
		try {
			const editedUser = await this.settingsService.editUser(select, user, data);

			return editedUser;
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Unhandled exception.';

			throw new ForbiddenException(message);
		}
	}
}
