import { ConfigModule } from '$common/configs/config.module';
import { EnvironmentConfig } from '$common/configs/env.validation';
import { Module } from '@nestjs/common';
import { MinioModule } from 'nestjs-minio-client';

@Module({
	imports: [
		ConfigModule,
		MinioModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: EnvironmentConfig) => ({
				endPoint: configService.MINIO_ENDPOINT,
				port: configService.MINIO_PORT,
				accessKey: configService.MINIO_ACCESS_KEY,
				secretKey: configService.MINIO_SECRET_KEY,
				useSSL: false,
			}),
			inject: [EnvironmentConfig],
		}),
	],
	providers: [EnvironmentConfig],
})
export class MinioClientModule {}
