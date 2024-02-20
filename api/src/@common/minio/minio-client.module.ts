import { Module } from '@nestjs/common';
import { MinioModule } from 'nestjs-minio-client';
import { EnvironmentConfig } from '~env';
import { MinioClientService } from './minio-client.service';

@Module({
	imports: [
		MinioModule.registerAsync({
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
	providers: [MinioClientService],
	exports: [MinioClientService],
})
export class MinioClientModule {}
