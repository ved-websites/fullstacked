import { OnEvent, type EventData } from '$events/events.decorator';
import { MinioClientService } from '$minio/minio-client.service';
import { Injectable, Logger } from '@nestjs/common';
import { PROFILE_PICTURE_BUCKET_NAME } from '../profile-picture.service';
import { PROFILE_PICTURE_UPLOAD_EVENT } from './profile-picture.events';

@Injectable()
export class ProfilePictureListener {
	private readonly logger = new Logger(ProfilePictureListener.name);

	constructor(private minioClientService: MinioClientService) {}

	@OnEvent(PROFILE_PICTURE_UPLOAD_EVENT)
	async handleProfilePictureUploadEvent({ profilePictureRef }: EventData<typeof PROFILE_PICTURE_UPLOAD_EVENT>) {
		if (!profilePictureRef) {
			// No previous file to delete, so early exit.
			return;
		}

		try {
			await this.minioClientService.delete(profilePictureRef, PROFILE_PICTURE_BUCKET_NAME);
		} catch (error) {
			this.logger.warn(`Couldn't delete user's profile picture named '${profilePictureRef}'!`, error);
		}
	}
}
