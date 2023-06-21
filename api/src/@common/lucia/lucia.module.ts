import { ConfigModule } from '$common/configs/config.module';
import { EnvironmentConfig } from '$common/configs/env.validation';
import { PrismaModule } from '$common/prisma/prisma.module';
import { PrismaService } from '$common/prisma/prisma.service';
import { Module } from '@nestjs/common';
import { luciaFactory } from './lucia.factory';
import { AuthenticationMiddleware } from './lucia.middleware';

export const AuthFactory = 'AUTH';

@Module({
	imports: [PrismaModule, ConfigModule],
	providers: [
		{
			provide: AuthFactory,
			inject: [PrismaService, EnvironmentConfig],
			useFactory: luciaFactory,
		},
		AuthenticationMiddleware,
	],
	exports: [AuthFactory, AuthenticationMiddleware],
})
export class LuciaModule {}

export type { Auth } from './lucia.factory';
