import { ConfigModule } from '$common/configs/config.module';
import { EnvironmentConfig } from '$common/configs/env.validation';
import { PrismaModule } from '$common/prisma/prisma.module';
import { PrismaService } from '$common/prisma/prisma.service';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LuciaFactory, luciaFactory } from './lucia.factory';
import { LuciaMiddleware } from './lucia.middleware';

@Module({
	imports: [PrismaModule, ConfigModule],
	providers: [
		{
			provide: LuciaFactory,
			inject: [PrismaService, EnvironmentConfig],
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
