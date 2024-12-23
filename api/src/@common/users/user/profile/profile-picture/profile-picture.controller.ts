import { TypedI18nService } from '$i18n/i18n.service';
import { FileValidationPipe } from '$minio/minio-client.constants';
import { Public } from '$users/auth/auth.guard';
import { AuthUser, LuciaUser } from '$users/auth/session.decorator';
import { BadRequestException, Controller, Get, Header, Param, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { r } from '~contract';
import { ProfilePictureService } from './profile-picture.service';

@Controller()
export class ProfilePictureController {
	static readonly PROFILE_PICTURE_MAX_AGE_MINUTES = 15;

	constructor(
		private profilePictureService: ProfilePictureService,
		private readonly i18n: TypedI18nService,
	) {}

	@Public()
	@Get('profile-pictures/:ref')
	@Header('Cache-Control', `max-age=${ProfilePictureController.PROFILE_PICTURE_MAX_AGE_MINUTES * 60 * 1000}`)
	async getUserProfilePicture(@Param('ref') ref: string) {
		try {
			const profilePictureFile = await this.profilePictureService.getImage(ref);

			const extension = ref.substring(ref.lastIndexOf('.') + 1, ref.length);

			return new StreamableFile(profilePictureFile, {
				type: `image/${extension}`,
			});
		} catch (_error) {
			throw new BadRequestException(this.i18n.t('files.errors.profile-picture.nonexistent'));
		}
	}

	@TsRestHandler(r.user.settings.profile.uploadPicture)
	@UseInterceptors(FileInterceptor('profile-picture'))
	async uploadProfilePicture(@AuthUser() user: LuciaUser, @UploadedFile(FileValidationPipe) file: Express.Multer.File) {
		return tsRestHandler(r.user.settings.profile.uploadPicture, async () => {
			await this.profilePictureService.uploadImage(file, user);

			return {
				status: 200,
				body: undefined,
			};
		});
	}

	@TsRestHandler(r.user.settings.profile.deletePicture)
	async deleteProfilePicture(@AuthUser() user: LuciaUser) {
		return tsRestHandler(r.user.settings.profile.deletePicture, async () => {
			await this.profilePictureService.deleteUserImage(user);

			return {
				status: 200,
				body: undefined,
			};
		});
	}
}
