import { Session } from '$prisma-graphql/session';
import { User } from '$prisma-graphql/user';
import { PrismaSelector } from '$prisma/prisma.service';
import { SelectQL } from '$prisma/select-ql.decorator';
import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { type Session as LuciaSession } from 'lucia';
import { ErrorMessage } from 'lucia/dist/auth/error';
import { Public } from './auth.guard';
import { AuthService } from './auth.service';
import { LoggedUserOutput } from './dtos/logged-user.output';
import { LoginUserInput } from './dtos/login-user.input';
import { LogoutOutput } from './dtos/logout.output';
import { RegisterInput } from './dtos/register.input';
import { RenewedSessionOutput } from './dtos/renewed-session.output';
import { UnregisteredUserOutput } from './dtos/unregistered-user.output';
import { LuciaAuth, LuciaAuthRequest } from './lucia/lucia.decorator';
import { loadLuciaModule } from './lucia/modules-compat';
import { AuthSession } from './session.decorator';

@Resolver()
export class AuthResolver {
	constructor(private readonly authService: AuthService) {}

	@Query(() => User)
	async getSessionUser(@AuthSession() { user }: LuciaSession, @SelectQL() select: PrismaSelector) {
		const authUser = this.authService.getAuthUser(user.email, select);

		return authUser;
	}

	@Public()
	@Query(() => UnregisteredUserOutput)
	async getUnregisteredUser(@Args('registerToken') registerToken: string) {
		const user = await this.authService.getUnregisteredUser(registerToken);

		return user;
	}

	@Public()
	@Mutation(() => Session)
	async register(@LuciaAuth() authRequest: LuciaAuthRequest, @Args('data') { registerToken, password, ...attributes }: RegisterInput) {
		const session = await this.authService.register(registerToken, password, attributes);

		authRequest.setSession(session);

		return session;
	}

	@Public()
	@Mutation(() => LoggedUserOutput)
	async login(@LuciaAuth() authRequest: LuciaAuthRequest, @Args('data') { email, password }: LoginUserInput) {
		try {
			const session = await this.authService.login(email, password);

			authRequest.setSession(session);

			return {
				accessToken: session.sessionId,
			} as LoggedUserOutput;
		} catch (error) {
			const { LuciaError } = await loadLuciaModule();

			if (error instanceof LuciaError) {
				const userPassError: ErrorMessage[] = ['AUTH_INVALID_PASSWORD', 'AUTH_INVALID_KEY_ID'];

				if (userPassError.includes(error.message)) {
					throw new UnauthorizedException('Invalid username or password!');
				}
			}

			throw new InternalServerErrorException();
		}
	}

	@Mutation(() => LogoutOutput)
	async logout(@LuciaAuth() authRequest: LuciaAuthRequest, @AuthSession() session: LuciaSession | null) {
		if (session) {
			await this.authService.logout(session.sessionId);

			authRequest.setSession(null);

			return {
				loggedOut: true,
			} as LogoutOutput;
		}

		return {
			loggedOut: false,
		} as LogoutOutput;
	}

	@Mutation(() => RenewedSessionOutput, { nullable: true })
	async renewSession(@LuciaAuth() authRequest: LuciaAuthRequest) {
		const session = await authRequest.validateBearerToken();

		authRequest.setSession(session);

		if (!session) {
			return null;
		}

		return {
			accessToken: session.sessionId,
		} as RenewedSessionOutput;
	}
}
