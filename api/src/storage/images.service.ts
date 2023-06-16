import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import type { BufferedFile } from '../@common/minio/file.model';
import { MinioClientService } from '../@common/minio/minio-client.service';

@Injectable()
export class ImagesService {
	constructor(private minioClientService: MinioClientService) {}

	readonly acceptedMimeType: string[] = ['jpeg', 'png'];

	async uploadImage(image: BufferedFile) {
		if (!this.acceptedMimeType.includes(image.mimetype)) {
			throw new HttpException('Image type not supported', HttpStatus.BAD_REQUEST);
		}

		const uploadedImage = await this.minioClientService.upload(image, 'images');

		return uploadedImage;
	}
}
