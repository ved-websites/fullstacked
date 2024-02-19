import { AuthUser, LuciaUser } from '$users/auth/session.decorator';
import { Origin } from '$utils/origin.decorator';
import { Controller, ForbiddenException } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { r } from '~contract';
import { UserProfileService } from './profile.service';

@Controller()
export class ProfileController {
	constructor(private readonly profileService: UserProfileService) {}

	@TsRestHandler(r.user.settings.profile.update)
	async editUserProfile(@AuthUser() user: LuciaUser) {
		return tsRestHandler(r.user.settings.profile.update, async ({ body }) => {
			try {
				await this.profileService.editUser(user, body);

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

	@TsRestHandler(r.user.settings.profile.requestUpdateEmail)
	async requestEditUserEmail(@AuthUser() user: LuciaUser, @Origin() origin: string) {
		return tsRestHandler(r.user.settings.profile.requestUpdateEmail, async ({ body }) => {
			try {
				const result = await this.profileService.requestEditUserEmail(user, body.email, origin);

				return {
					status: 200,
					body: {
						success: result,
					},
				};
			} catch (error) {
				const message = error instanceof Error ? error.message : 'Unhandled exception.';

				throw new ForbiddenException(message);
			}
		});
	}

	@TsRestHandler(r.user.settings.profile.updateEmail, { jsonQuery: true })
	async editUserEmail(@AuthUser() user: LuciaUser, @Origin() origin: string) {
		return tsRestHandler(r.user.settings.profile.updateEmail, async ({ body }) => {
			try {
				const result = await this.profileService.editUserEmail(body.token, origin);

				return {
					status: 200,
					body: {
						success: result,
					},
				};
			} catch (error) {
				const message = error instanceof Error ? error.message : 'Unhandled exception.';

				throw new ForbiddenException(message);
			}
		});
	}
}
