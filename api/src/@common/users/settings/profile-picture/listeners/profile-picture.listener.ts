import { MinioClientService } from '$minio/minio-client.service';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PROFILE_PICTURE_BUCKET_NAME } from '../profile-picture.service';
import { PROFILE_PICTURE_UPLOAD_EVENT_KEY, PROFILE_PICTURE_UPLOAD_EVENT_TYPE } from './profile-picture.events';

@Injectable()
export class ProfilePictureListener {
	private readonly logger = new Logger(ProfilePictureListener.name);

	constructor(private minioClientService: MinioClientService) {}

	@OnEvent(PROFILE_PICTURE_UPLOAD_EVENT_KEY)
	async handleProfilePictureUploadEvent({ profilePictureRef }: PROFILE_PICTURE_UPLOAD_EVENT_TYPE) {
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
