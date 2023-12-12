import { TypedI18nModule } from '$i18n/i18n.module';
import { MinioClientModule } from '$minio/minio-client.module';
import { Module } from '@nestjs/common';
import { ProfilePictureListener } from './listeners/profile-picture.listener';
import { ProfilePictureController } from './profile-picture.controller';
import { ProfilePictureResolver } from './profile-picture.resolver';
import { ProfilePictureService } from './profile-picture.service';

@Module({
	imports: [MinioClientModule, TypedI18nModule],
	controllers: [ProfilePictureController],
	providers: [ProfilePictureService, ProfilePictureResolver, ProfilePictureListener],
})
export class ProfilePictureModule {}
