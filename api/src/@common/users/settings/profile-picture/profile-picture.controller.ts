import { BadRequestException, Controller, Get, Header, Param, StreamableFile } from '@nestjs/common';
import { ProfilePictureService } from './profile-picture.service';

@Controller('profile-pictures')
export class ProfilePictureController {
	static readonly PROFILE_PICTURE_MAX_AGE_MINUTES = 15;

	constructor(private profilePictureService: ProfilePictureService) {}

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
			throw new BadRequestException('Profile picture does not exist!');
		}
	}
}
