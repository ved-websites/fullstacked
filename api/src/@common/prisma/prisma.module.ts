import { Global, Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { PrismaService } from './prisma.service';

@Global()
@Module({
	providers: [
		PrismaService,
		{
			provide: 'PUB_SUB',
			useValue: new PubSub(),
		},
	],
	exports: [PrismaService, 'PUB_SUB'],
})
export class PrismaModule {}
