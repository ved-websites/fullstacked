import { ConfigModule } from '$configs/config.module';
import { EnvironmentConfig } from '$configs/env.validation';
import { PrismaModule } from '$prisma/prisma.module';
import { PrismaService } from '$prisma/prisma.service';
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
