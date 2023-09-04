import { getSchema } from '$configs/helpers';
import { PrismaModule } from '$prisma/prisma.module';
import { PrismaService } from '$prisma/prisma.service';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LuciaFactory, luciaFactory } from './lucia.factory';
import { LuciaMiddleware } from './lucia.middleware';

@Module({
	imports: [PrismaModule],
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