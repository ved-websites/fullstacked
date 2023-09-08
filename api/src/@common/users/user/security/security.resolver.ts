import { AuthSession, LuciaSession } from '$users/auth/session.decorator';
import { ForbiddenException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserSecurityService } from './security.service';

@Resolver()
export class UserSecurityResolver {
	constructor(private readonly securityService: UserSecurityService) {}

	@Mutation(() => Boolean, { nullable: true })
	async editSelfPassword(@Args('password') password: string, @AuthSession() session: LuciaSession) {
		try {
			await this.securityService.editSelfPassword(session, password);

			return true;
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Unhandled exception.';

			throw new ForbiddenException(message);
		}
	}
}
