import { AuthUser, LuciaUser } from '$users/auth/session.decorator';
import { Controller, ForbiddenException } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { r } from '~contract';
import { UserSecurityService } from './security.service';

@Controller()
export class SecurityController {
	constructor(private readonly securityService: UserSecurityService) {}

	@TsRestHandler(r.user.settings.security.changePassword)
	async editSelfPassword(@AuthUser() user: LuciaUser) {
		return tsRestHandler(r.user.settings.security.changePassword, async ({ body: { password } }) => {
			try {
				await this.securityService.editSelfPassword(user, password);

				return {
					status: 200,
					body: undefined,
				};
			} catch (error) {
				const message = error instanceof Error ? error.message : 'Unhandled exception.';

				throw new ForbiddenException(message);
			}
		});
	}
}
