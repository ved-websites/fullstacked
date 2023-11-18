import { TypedI18nService } from '$i18n/i18n.service';
import { BadRequestException, Controller, Get, Header, Param, StreamableFile } from '@nestjs/common';
import { ProfilePictureService } from './profile-picture.service';

@Controller('profile-pictures')
export class ProfilePictureController {
	static readonly PROFILE_PICTURE_MAX_AGE_MINUTES = 15;

	constructor(
		private profilePictureService: ProfilePictureService,
		private readonly i18n: TypedI18nService,
	) {}

	@Get(':ref')
	@Header('Cache-Control', `max-age=${ProfilePictureController.PROFILE_PICTURE_MAX_AGE_MINUTES * 60 * 1000}`)
	async getUserProfilePicture(@Param('ref') ref: string) {
		try {
			const profilePictureFile = await this.profilePictureService.getImage(ref);

			const extension = ref.substring(ref.lastIndexOf('.') + 1, ref.length);

			return new StreamableFile(profilePictureFile, {
				type: `image/${extension}`,
			});
		} catch (error) {
			throw new BadRequestException(this.i18n.t('files.errors.profile-picture.nonexistent'));
		}
	}
}
