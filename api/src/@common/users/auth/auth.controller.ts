import { TypedI18nService } from '$i18n/i18n.service';
import { Controller } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { r } from '~contract';
import { AuthService } from './auth.service';
import { AuthUser, LuciaUser } from './session.decorator';

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
}
