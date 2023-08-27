import { MinioClientModule } from '$minio/minio-client.module';
import { PrismaModule } from '$prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ProfilePictureController } from './profile-picture.controller';
import { ProfilePictureResolver } from './profile-picture.resolver';
import { ProfilePictureService } from './profile-picture.service';

@Module({
	imports: [PrismaModule, MinioClientModule],
	controllers: [ProfilePictureController],
	providers: [ProfilePictureService, ProfilePictureResolver],
})
export class ProfilePictureModule {}
