import { sensitiveThrottlerConf } from '$app/throttler.guard';
import { CommonGQLContext } from '$graphql/context/context.service';
import { getErrorMessage } from '$i18n/i18n.error';
import { TypedI18nService } from '$i18n/i18n.service';
import { Session } from '$prisma-graphql/session';
import { User, UserWhereUniqueInput } from '$prisma-graphql/user';
import { PrismaSelector } from '$prisma/prisma.service';
import { SelectQL } from '$prisma/select-ql.decorator';
import { LiveUser } from '$users/dtos/LiveUser.dto';
import { Origin } from '$utils/origin.decorator';
import { ForbiddenException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { Throttle } from '@nestjs/throttler';
import { ErrorMessage } from 'lucia/dist/auth/error';
import { I18n, I18nContext } from 'nestjs-i18n';
import { Public } from './auth.guard';
import { AuthService } from './auth.service';
import { USER_EDITED } from './constants/triggers';
import { ForgotPasswordRequestOutput } from './dtos/forgot-password-request.output';
import { LoggedUserOutput } from './dtos/logged-user.output';
import { LoginUserInput } from './dtos/login-user.input';
import { RegisterInput } from './dtos/register.input';
import { RenewedSessionOutput } from './dtos/renewed-session.output';
import { ResetPasswordInput } from './dtos/reset-password.input';
import { UnregisteredUserOutput } from './dtos/unregistered-user.output';
import { LuciaAuth, LuciaAuthRequest } from './lucia/lucia.decorator';
import { loadLuciaModule } from './lucia/modules-compat';
import { AuthSession, LuciaSession } from './session.decorator';

@Resolver()
export class AuthResolver {
	constructor(
		private readonly authService: AuthService,
		private readonly i18n: TypedI18nService,
	) {}

	@Query(() => LiveUser)
	async getSessionUser(@AuthSession() { user }: LuciaSession, @SelectQL() select: PrismaSelector) {
		const authUser = await this.authService.getAuthUser(user.email, select);

		return authUser satisfies LiveUser | null;
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
					throw new UnauthorizedException(this.i18n.t('auth.errors.login'));
				}
			}

			throw new InternalServerErrorException(this.i18n.t('common.errors.internal-server-error'));
		}
	}

	@Mutation(() => Boolean)
	async logout(@AuthSession() session: LuciaSession | null, @Context() { res }: CommonGQLContext) {
		if (session) {
			const sessionCookie = await this.authService.logout(session);

			res.cookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

			return true;
		}

		return false;
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

	@Public()
	@Mutation(() => ForgotPasswordRequestOutput)
	async forgotPasswordRequest(@Args('email') email: string, @Origin() origin: string) {
		const token = await this.authService.getForgotPasswordRequestToken();

		this.authService.sendPasswordResetRequestEmail(email, token, { url: origin });

		return {
			token,
		} satisfies ForgotPasswordRequestOutput;
	}

	@Throttle(...sensitiveThrottlerConf)
	@Public()
	@Query(() => User, { nullable: true })
	async verifyPasswordResetAttempt(@Args('token') token: string) {
		const pswResetAttempt = await this.authService.getPasswordResetAttempt(token);

		if (!pswResetAttempt) {
			return null;
		}

		return pswResetAttempt.user satisfies User;
	}

	@Throttle(...sensitiveThrottlerConf)
	@Public()
	@Mutation(() => Boolean)
	async resetPassword(@I18n() i18n: I18nContext, @Args('data') { token, password }: ResetPasswordInput, @Origin() origin: string) {
		try {
			const { user } = await this.authService.resetPassword(token, password);

			this.authService.sendPasswordResetSuccessEmail(user, { url: origin });

			return true satisfies boolean;
		} catch (error) {
			const message = getErrorMessage(error, i18n);

			throw new ForbiddenException(message);
		}
	}

	@Subscription(() => LiveUser, {
		name: USER_EDITED,
		filter: (payload: { [USER_EDITED]: LiveUser }, variables) => {
			const { id, email } = variables.where as UserWhereUniqueInput;

			if (id) {
				return id === payload[USER_EDITED].id;
			}

			if (email) {
				return email === payload[USER_EDITED].email;
			}

			return false;
		},
	})
	subscribeUserEdited(@SelectQL() select: PrismaSelector, @Args('where') _where: UserWhereUniqueInput) {
		return this.authService.subscribeUserEdited(select, USER_EDITED);
	}
}
