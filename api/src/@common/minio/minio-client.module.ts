import { ConfigModule } from '$configs/config.module';
import { Module } from '@nestjs/common';
import { MinioModule } from 'nestjs-minio-client';
import { EnvironmentConfig } from '~/env.validation';

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
