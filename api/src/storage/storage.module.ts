import { MinioClientModule } from '$common/minio/minio-client.module';
import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';

@Module({
	imports: [MinioClientModule],
	controllers: [ImagesController],
	providers: [ImagesService],
})
export class StorageModule {}
