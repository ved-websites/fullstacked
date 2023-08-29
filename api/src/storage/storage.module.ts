import { MinioClientModule } from '$minio/minio-client.module';
import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';

@Module({
	imports: [MinioClientModule],
	controllers: [],
	providers: [ImagesService],
})
export class StorageModule {}
