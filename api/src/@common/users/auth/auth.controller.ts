import { sensitiveThrottlerConf } from '$app/throttler.guard';
import { getErrorMessage } from '$i18n/i18n.error';
import { TypedI18nService } from '$i18n/i18n.service';
import { Origin } from '$utils/origin.decorator';
import { Controller, ForbiddenException, InternalServerErrorException, Res, UnauthorizedException } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import type { Response } from 'express';
import { I18n, I18nContext } from 'nestjs-i18n';
import { r } from '~contract';
import { AuthError } from './auth.error';
import { Public } from './auth.guard';
import { AuthService } from './auth.service';
import { setResponseCookie } from './lucia/lucia.factory';
import { AuthSession, AuthUser, LuciaSession, LuciaUser } from './session.decorator';

@Controller()
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly i18n: TypedI18nService,
	) {}

	@TsRestHandler(r.auth.session)
	getAuthUser(@AuthUser() authUser: LuciaUser) {
		return tsRestHandler(r.auth.session, async () => {
			const user = await this.authService.getAuthUser(authUser.email);

			return {
				status: 200,
				body: user,
			};
		});
	}

	@Public()
	@TsRestHandler(r.auth.login)
	login(@Res({ passthrough: true }) res: Response) {
		return tsRestHandler(r.auth.login, async ({ body: { email, password } }) => {
			try {
				const { sessionCookie } = await this.authService.login(email, password);

				setResponseCookie(res, sessionCookie);

				return {
					status: 200,
					body: {
						accessToken: sessionCookie.value,
					},
				};
			} catch (error) {
				if (error instanceof AuthError) {
					throw new UnauthorizedException(this.i18n.t('auth.errors.login'));
				}

				throw new InternalServerErrorException(this.i18n.t('common.errors.internal-server-error'));
			}
		});
	}

	@TsRestHandler(r.auth.logout)
	logout(@AuthSession() session: LuciaSession, @Res({ passthrough: true }) res: Response) {
		return tsRestHandler(r.auth.logout, async () => {
			const sessionCookie = await this.authService.logout(session);

			setResponseCookie(res, sessionCookie);

			return {
				status: 200,
				body: true,
			};
		});
	}

	@Public()
	@TsRestHandler(r.auth.initRegistration)
	initRegistration() {
		return tsRestHandler(r.auth.initRegistration, async ({ query: { registerToken } }) => {
			const user = await this.authService.getUnregisteredUser(registerToken);

			return {
				status: 200,
				body: user,
			};
		});
	}

	@Public()
	@TsRestHandler(r.auth.register)
	register(@Res({ passthrough: true }) res: Response) {
		return tsRestHandler(r.auth.register, async ({ body: { registerToken, password, user: userAttributes } }) => {
			const { sessionCookie } = await this.authService.register(registerToken, password, userAttributes);

			setResponseCookie(res, sessionCookie);

			return {
				status: 200,
				body: true,
			};
		});
	}

	@Public()
	@Throttle(...sensitiveThrottlerConf)
	@TsRestHandler(r.auth.forgotPasswordRequest)
	forgotPasswordRequest(@Origin() origin: string) {
		return tsRestHandler(r.auth.forgotPasswordRequest, async ({ query: { email } }) => {
			const token = await this.authService.getForgotPasswordRequestToken();

			this.authService.sendPasswordResetRequestEmail(email, token, { url: origin });

			return {
				status: 200,
				body: token,
			};
		});
	}

	@Public()
	@Throttle(...sensitiveThrottlerConf)
	@TsRestHandler(r.auth.verifyPasswordResetAttempt)
	verifyPasswordResetAttempt() {
		return tsRestHandler(r.auth.verifyPasswordResetAttempt, async ({ query: { resetToken } }) => {
			const pswResetAttempt = await this.authService.getPasswordResetAttempt(resetToken);

			if (!pswResetAttempt) {
				return {
					status: 400,
					body: {
						message: 'No password reset attempt',
					},
				};
			}

			return {
				status: 200,
				body: pswResetAttempt.user,
			};
		});
	}

	@Public()
	@Throttle(...sensitiveThrottlerConf)
	@TsRestHandler(r.auth.resetPassword)
	resetPassword(@Origin() origin: string, @I18n() i18n: I18nContext) {
		return tsRestHandler(r.auth.resetPassword, async ({ body: { resetToken, password } }) => {
			try {
				const { user } = await this.authService.resetPassword(resetToken, password);

				this.authService.sendPasswordResetSuccessEmail(user, { url: origin });

				return {
					status: 200,
					body: true,
				};
			} catch (error) {
				const message = getErrorMessage(error, i18n);

				throw new ForbiddenException(message);
			}
		});
	}
}
