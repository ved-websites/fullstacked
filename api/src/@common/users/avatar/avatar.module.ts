import { MinioClientModule } from '$minio/minio-client.module';
import { PrismaModule } from '$prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AvatarController } from './avatar.controller';
import { AvatarResolver } from './avatar.resolver';
import { AvatarService } from './avatar.service';

@Module({
	imports: [PrismaModule, MinioClientModule],
	controllers: [AvatarController],
	providers: [AvatarService, AvatarResolver],
})
export class AvatarModule {}
