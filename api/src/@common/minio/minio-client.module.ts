import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { MinioModule } from 'nestjs-minio-client';
import { EnvironmentConfig } from '~/env.validation';
import { MinioClientService } from './minio-client.service';

export const GRAPHQL_MAX_FILE_SIZE_MB = 10;
export const GRAPHQL_MAX_FILE_COUNT = 10;

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
export class MinioClientModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		const byteToMbRatio = 1000000;

		consumer
			.apply(graphqlUploadExpress({ maxFileSize: GRAPHQL_MAX_FILE_SIZE_MB * byteToMbRatio, maxFiles: GRAPHQL_MAX_FILE_COUNT }))
			.forRoutes('/graphql');
	}
}
