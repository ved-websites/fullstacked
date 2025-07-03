import { AppUser, AuthUser } from '$users/auth/session/session.decorator';
import { Controller, ForbiddenException } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { r } from '~contract';
import { UserProfileService } from './profile.service';

@Controller()
export class ProfileController {
	constructor(private readonly profileService: UserProfileService) {}

	@TsRestHandler(r.user.settings.profile.update)
	async editUserProfile(@AuthUser() user: AppUser) {
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
}
