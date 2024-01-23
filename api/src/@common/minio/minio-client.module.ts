import { TypedI18nModule } from '$i18n/i18n.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { MinioModule } from 'nestjs-minio-client';
import { EnvironmentConfig } from '~env';
import { MAX_FILE_COUNT, MAX_FILE_SIZE_MB, byteToMbRatio } from './minio-client.constants';
import { MinioClientService } from './minio-client.service';

@Module({
	imports: [
		TypedI18nModule,
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
		consumer.apply(graphqlUploadExpress({ maxFileSize: MAX_FILE_SIZE_MB * byteToMbRatio, maxFiles: MAX_FILE_COUNT })).forRoutes('/graphql');
	}
}
