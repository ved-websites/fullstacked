import { Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { PrismaService } from './prisma.service';

@Module({
	providers: [
		PrismaService,
		{
			provide: 'PUB_SUB',
			useValue: new PubSub(),
		},
	],
	exports: [PrismaService],
})
export class PrismaModule {}
