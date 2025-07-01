import { OnEvent, type EventData } from '$events/events.decorator';
import { MinioClientService } from '$minio/minio-client.service';
import { Injectable, Logger } from '@nestjs/common';
import { ProfilePictureService } from '../profile-picture.service';
import { PROFILE_PICTURE_EDIT_EVENT } from './profile-picture.events';

@Injectable()
export class ProfilePictureListener {
	private readonly logger = new Logger(ProfilePictureListener.name);

	constructor(private minioClientService: MinioClientService) {}

	@OnEvent(PROFILE_PICTURE_EDIT_EVENT)
	async handleProfilePictureUploadEvent({
		userEmail,
		oldProfilePictureRef,
		newProfilePictureRef,
	}: EventData<typeof PROFILE_PICTURE_EDIT_EVENT>) {
		if (!oldProfilePictureRef) {
			this.logger.debug(`No old profile picture to delete for "${userEmail}" user.`);
			return;
		}

		if (oldProfilePictureRef === newProfilePictureRef) {
			this.logger.debug(`No change in profile picture for "${userEmail}" user.`);
			return;
		}

		try {
			await this.minioClientService.delete(oldProfilePictureRef, {
				dir: ProfilePictureService.PROFILE_PICTURE_DIR,
			});
		} catch (error) {
			this.logger.warn(`Couldn't delete "${userEmail}" user's profile picture named '${oldProfilePictureRef}'!`, error);
		}
	}
}
