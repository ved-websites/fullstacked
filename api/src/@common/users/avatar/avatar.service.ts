import { MinioClientService } from '$minio/minio-client.service';
import { PrismaService } from '$prisma/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload/Upload.js';
import { User } from 'lucia';

export const AVATAR_BUCKET_NAME = 'avatars';

@Injectable()
export class AvatarService {
	constructor(
		private minioClientService: MinioClientService,
		private prisma: PrismaService,
	) {}

	readonly acceptedFileExtension: string[] = ['jpeg', 'jpg', 'png', 'webp'];

	async uploadImage(file: FileUpload, user: User) {
		if (!this.acceptedFileExtension.some((extension) => file.filename.endsWith(extension))) {
			throw new HttpException('Image type not supported.', HttpStatus.BAD_REQUEST);
		}

		const uploadedImage = await this.minioClientService.upload(file, AVATAR_BUCKET_NAME);

		try {
			await this.prisma.user.update({
				data: {
					avatarRef: uploadedImage.fileName,
				},
				where: {
					id: user.id,
				},
			});
		} catch (error) {
			await this.minioClientService.delete(uploadedImage.fileName, AVATAR_BUCKET_NAME);
		}

		return uploadedImage;
	}

	async getUserImage({ avatarRef }: User) {
		if (!avatarRef) {
			return;
		}

		return this.getImage(avatarRef);
	}

	async getImage(avatarRef: string) {
		const avatarFile = await this.minioClientService.get(avatarRef, AVATAR_BUCKET_NAME);

		return avatarFile;
	}

	async deleteUserImage(user: User) {
		if (!user.avatarRef) {
			return;
		}

		await this.minioClientService.delete(user.avatarRef, AVATAR_BUCKET_NAME);

		await this.prisma.user.update({
			data: {
				avatarRef: null,
			},
			where: {
				id: user.id,
			},
		});
	}
}
