import { MinioClientService } from '$minio/minio-client.service';
import { PrismaService } from '$prisma/prisma.service';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FileUpload } from 'graphql-upload/Upload.js';
import { User } from 'lucia';
import { PROFILE_PICTURE_UPLOAD_EVENT_KEY, PROFILE_PICTURE_UPLOAD_EVENT_TYPE } from './listeners/profile-picture.events';

export const PROFILE_PICTURE_BUCKET_NAME = 'profile-pictures';

@Injectable()
export class ProfilePictureService {
	private readonly logger = new Logger(ProfilePictureService.name);

	constructor(
		private minioClientService: MinioClientService,
		private prisma: PrismaService,
		private eventEmitter: EventEmitter2,
	) {}

	readonly acceptedFileExtension: string[] = ['jpeg', 'jpg', 'png', 'webp'];

	async uploadImage(file: FileUpload, user: User) {
		if (!this.acceptedFileExtension.some((extension) => file.filename.endsWith(extension))) {
			throw new HttpException('Image type not supported.', HttpStatus.BAD_REQUEST);
		}

		const uploadedImage = await this.minioClientService.upload(file, PROFILE_PICTURE_BUCKET_NAME);

		try {
			await this.prisma.user.update({
				data: {
					profilePictureRef: uploadedImage.fileName,
				},
				where: {
					id: user.id,
				},
			});
		} catch (error) {
			await this.minioClientService.delete(uploadedImage.fileName, PROFILE_PICTURE_BUCKET_NAME);
		}

		this.eventEmitter.emit(PROFILE_PICTURE_UPLOAD_EVENT_KEY, {
			profilePictureRef: user.profilePictureRef,
		} satisfies PROFILE_PICTURE_UPLOAD_EVENT_TYPE);

		return uploadedImage;
	}

	async getUserImage({ profilePictureRef }: User) {
		if (!profilePictureRef) {
			return;
		}

		return this.getImage(profilePictureRef);
	}

	async getImage(profilePictureRef: string) {
		const profilePictureFile = await this.minioClientService.get(profilePictureRef, PROFILE_PICTURE_BUCKET_NAME);

		return profilePictureFile;
	}

	async deleteUserImage(user: User) {
		if (!user.profilePictureRef) {
			return false;
		}

		this.minioClientService.delete(user.profilePictureRef, PROFILE_PICTURE_BUCKET_NAME).catch((e) => {
			this.logger.error(`Couldn't delete profile picture of user "${user.email}"!`, e instanceof Error ? e.stack : undefined);
		});

		await this.prisma.user.update({
			data: {
				profilePictureRef: null,
			},
			where: {
				id: user.id,
			},
		});

		return true;
	}
}
