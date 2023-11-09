import { User, UserUpdateInput } from '$prisma-graphql/user';
import { PrismaSelector } from '$prisma/prisma.service';
import { SelectQL } from '$prisma/select-ql.decorator';
import { AuthSession, LuciaSession } from '$users/auth/session.decorator';
import { ForbiddenException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserProfileService } from './profile.service';

@Resolver()
export class UserProfileResolver {
	constructor(private readonly profileService: UserProfileService) {}

	@Mutation(() => User)
	async editUserProfile(@SelectQL() select: PrismaSelector, @Args('data') data: UserUpdateInput, @AuthSession() { user }: LuciaSession) {
		try {
			const editedUser = await this.profileService.editUser(select, user, data);

			return editedUser;
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Unhandled exception.';

			throw new ForbiddenException(message);
		}
	}
}
