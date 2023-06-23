import type { BufferedFile } from '$minio/file.model';
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { ImagesService } from './images.service';

@Controller('images')
export class ImagesController {
	constructor(private imageUploadService: ImagesService) {}

	@Post('upload')
	@UseInterceptors(FileInterceptor('image'))
	async uploadImage(@UploadedFile() image: BufferedFile) {
		const uploadedImage = await this.imageUploadService.uploadImage(image);

		return {
			imageUrl: uploadedImage.url,
			message: 'Image upload successful',
		};
	}
}
