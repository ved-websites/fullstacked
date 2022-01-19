import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PubSub } from './pub-sub';

@Module({
	providers: [PrismaService, PubSub],
	exports: [PrismaService, PubSub],
})
export class PrismaModule {}
