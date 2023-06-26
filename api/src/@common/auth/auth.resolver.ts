import { User } from '$prisma-graphql/user';
import { PrismaSelector } from '$prisma/prisma.service';
import { SelectQL } from '$prisma/select-ql.decorator';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { Session } from 'lucia';
import { Public } from './auth.guard';
import { AuthService } from './auth.service';
import { LoggedUserOutput } from './dtos/logged-user.output';
import { LoginUserInput } from './dtos/login-user.input';
import { LogoutOutput } from './dtos/logout.output';
import { RenewedSessionOutput } from './dtos/renewed-session.output';
import { LuciaAuth, LuciaAuthRequest } from './lucia/lucia.decorator';
import { AuthSession } from './session.decorator';

@Resolver(() => User)
export class AuthResolver {
	constructor(private readonly authService: AuthService) {}

	@Query(() => User)
	async getSessionUser(@AuthSession() { user }: Session, @SelectQL() select: PrismaSelector) {
		const authUser = this.authService.getAuthUser(user.email, select);

		return authUser;
	}

	// @Mutation(() => RegisterOutput)
	// async register(@LuciaAuth() auth: LuciaAuthRequest, @Args('data') { email, password }: RegisterInput) {
	// 	const session = await this.authService.register(email, password);

	// 	auth.setSession(session);

	// 	return {
	// 		accessToken: session.sessionId,
	// 	} as RegisterOutput;
	// }

	@Public()
	@Mutation(() => LoggedUserOutput)
	async login(@LuciaAuth() auth: LuciaAuthRequest, @Args('data') { email, password }: LoginUserInput) {
		const session = await this.authService.login(email, password);

		auth.setSession(session);

		return {
			accessToken: session.sessionId,
		} as LoggedUserOutput;
	}

	@Mutation(() => LogoutOutput)
	async logout(@LuciaAuth() auth: LuciaAuthRequest, @AuthSession() session: Session | null) {
		if (session) {
			await this.authService.logout(session.sessionId);

			auth.setSession(null);

			return {
				loggedOut: true,
			} as LogoutOutput;
		}

		return {
			loggedOut: false,
		} as LogoutOutput;
	}

	@Mutation(() => RenewedSessionOutput, { nullable: true })
	async renewSession(@LuciaAuth() auth: LuciaAuthRequest) {
		const session = await auth.renewBearerToken();

		auth.setSession(session);

		if (!session) {
			return null;
		}

		return {
			accessToken: session.sessionId,
		} as RenewedSessionOutput;
	}
}
