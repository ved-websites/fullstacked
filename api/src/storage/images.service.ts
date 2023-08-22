import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload/Upload.js';
import { MinioClientService } from '../@common/minio/minio-client.service';

@Injectable()
export class ImagesService {
	constructor(private minioClientService: MinioClientService) {}

	readonly acceptedMimeType: string[] = ['jpeg', 'png'];

	async uploadImage(file: FileUpload) {
		if (!this.acceptedMimeType.includes(file.mimetype)) {
			throw new HttpException('Image type not supported', HttpStatus.BAD_REQUEST);
		}

		const uploadedImage = await this.minioClientService.upload(file, 'images');

		return uploadedImage;
	}
}
