import { EventsService } from '$events/events.service';
import { MinioClientService } from '$minio/minio-client.service';
import { PrismaService } from '$prisma/prisma.service';
import { SocketService } from '$socket/socket.service';
import { PresenceService } from '$users/presence/presence.service';
import { Injectable, Logger } from '@nestjs/common';
import { User } from 'lucia';
import { wsR } from '~contract';
import { PROFILE_PICTURE_EDIT_EVENT } from './listeners/profile-picture.events';

export const PROFILE_PICTURE_BUCKET_NAME = 'profile-pictures';

@Injectable()
export class ProfilePictureService {
	private readonly logger = new Logger(ProfilePictureService.name);

	constructor(
		private readonly minioClientService: MinioClientService,
		private readonly prisma: PrismaService,
		private readonly events: EventsService,
		private readonly sockets: SocketService,
		private readonly presenceService: PresenceService,
	) {}

	async uploadImage(file: Express.Multer.File, user: User) {
		const uploadedImage = await this.minioClientService.upload(file, PROFILE_PICTURE_BUCKET_NAME);

		let newProfilePictureRef: string | null = uploadedImage.fileName;

		try {
			const editedUser = await this.prisma.user.update({
				data: {
					profilePictureRef: uploadedImage.fileName,
				},
				where: {
					id: user.id,
				},
				include: {
					roles: true,
				},
			});

			this.sockets.emit(wsR.users.edited, this.presenceService.convertUserToLiveUser(editedUser));
		} catch (_error) {
			await this.minioClientService.delete(uploadedImage.fileName, PROFILE_PICTURE_BUCKET_NAME);

			newProfilePictureRef = user.profilePictureRef;
		}

		this.events.emit(PROFILE_PICTURE_EDIT_EVENT, {
			userEmail: user.email,
			oldProfilePictureRef: user.profilePictureRef,
			newProfilePictureRef,
		});

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

		const editedUser = await this.prisma.user.update({
			data: {
				profilePictureRef: null,
			},
			where: {
				id: user.id,
			},
			include: {
				roles: true,
			},
		});

		this.sockets.emit(wsR.users.edited, this.presenceService.convertUserToLiveUser(editedUser));

		this.events.emit(PROFILE_PICTURE_EDIT_EVENT, {
			userEmail: user.email,
			oldProfilePictureRef: user.profilePictureRef,
			newProfilePictureRef: null,
		});

		return true;
	}
}
