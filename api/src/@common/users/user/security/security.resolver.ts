import { User } from '$prisma-graphql/user';
import { AuthSession, LuciaSession, LuciaUser } from '$users/auth/session.decorator';
import { ForbiddenException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserSecurityService } from './security.service';

@Resolver()
export class UserSecurityResolver {
	constructor(private readonly securityService: UserSecurityService) {}

	@Mutation(() => User, { nullable: true })
	async editSelfPassword(@Args('password') password: string, @AuthSession() session: LuciaSession) {
		try {
			const editedUser = await this.securityService.editSelfPassword(session, password);

			return editedUser.user satisfies LuciaUser;
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Unhandled exception.';

			throw new ForbiddenException(message);
		}
	}
}
