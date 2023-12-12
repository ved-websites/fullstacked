import { getSchema } from '$configs/helpers';
import { PrismaService } from '$prisma/prisma.service';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LuciaFactory, luciaFactory } from './lucia.factory';
import { LuciaMiddleware } from './lucia.middleware';

@Module({
	providers: [
		{
			provide: LuciaFactory,
			inject: [PrismaService, getSchema()],
			useFactory: luciaFactory,
		},
	],
	exports: [LuciaFactory],
})
export class LuciaModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LuciaMiddleware).forRoutes('*');
	}
}
