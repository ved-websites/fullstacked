import { TypedI18nService } from '$i18n/i18n.service';
import { Controller, InternalServerErrorException, Res, UnauthorizedException } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import type { Response } from 'express';
import { ErrorMessage } from 'lucia/dist/auth/error';
import { r } from '~contract';
import { Public } from './auth.guard';
import { AuthService } from './auth.service';
import { LuciaAuth, LuciaAuthRequest } from './lucia/lucia.decorator';
import { loadLuciaModule } from './lucia/modules-compat';
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

			// this.sockets.emit(wsR.messages.new, message);

			return {
				status: 200,
				body: user,
			};
		});
	}

	@Public()
	@TsRestHandler(r.auth.login)
	login(@LuciaAuth() authRequest: LuciaAuthRequest) {
		return tsRestHandler(r.auth.login, async ({ body: { email, password } }) => {
			try {
				const session = await this.authService.login(email, password);

				authRequest.setSession(session);

				return {
					status: 200,
					body: {
						accessToken: session.sessionId,
					},
				};
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
		});
	}

	@TsRestHandler(r.auth.logout)
	logout(@AuthSession() session: LuciaSession, @Res({ passthrough: true }) res: Response) {
		return tsRestHandler(r.auth.logout, async () => {
			const sessionCookie = await this.authService.logout(session);

			res.cookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

			return {
				status: 200,
				body: true,
			};
		});
	}
}
