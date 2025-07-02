import { getEnvSchema } from '$configs/helpers';
import { PrismaService } from '$prisma/prisma.service';
import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LuciaFactory, luciaFactory } from './lucia.factory';
import { LuciaMiddleware } from './lucia.middleware';

@Global()
@Module({
	providers: [
		{
			provide: LuciaFactory,
			inject: [PrismaService, getEnvSchema()],
			useFactory: luciaFactory,
		},
	],
	exports: [LuciaFactory],
})
export class LuciaModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LuciaMiddleware).forRoutes('{*slug}');
	}
}
