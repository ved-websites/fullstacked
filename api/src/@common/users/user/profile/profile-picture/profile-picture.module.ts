import { TypedI18nModule } from '$i18n/i18n.module';
import { MinioClientModule } from '$minio/minio-client.module';
import { PresenceModule } from '$users/presence/presence.module';
import { Module } from '@nestjs/common';
import { ProfilePictureListener } from './listeners/profile-picture.listener';
import { ProfilePictureController } from './profile-picture.controller';
import { ProfilePictureService } from './profile-picture.service';

@Module({
	imports: [MinioClientModule, TypedI18nModule, PresenceModule],
	controllers: [ProfilePictureController],
	providers: [ProfilePictureService, ProfilePictureListener],
	exports: [ProfilePictureService],
})
export class ProfilePictureModule {}
