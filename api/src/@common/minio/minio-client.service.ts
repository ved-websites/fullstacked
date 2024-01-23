import { TypedI18nService } from '$i18n/i18n.service';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { MinioService } from 'nestjs-minio-client';
import { EnvironmentConfig } from '~env';

@Injectable()
export class MinioClientService {
	private readonly logger = new Logger(MinioClientService.name);

	constructor(
		private readonly minio: MinioService,
		private readonly env: EnvironmentConfig,
		private readonly i18n: TypedI18nService,
	) {}

	public get client() {
		return this.minio.client;
	}

	protected getBucketName(bucketName: string) {
		if (bucketName.startsWith(this.env.MINIO_BUCKET_PREFIX)) {
			return bucketName;
		}

		return `${this.env.MINIO_BUCKET_PREFIX}-${bucketName}`;
	}

	protected async verifyBucketExistence(bucketName: string) {
		const appBucketName = this.getBucketName(bucketName);

		const bucketExists = await this.client.bucketExists(appBucketName);

		if (bucketExists) {
			return;
		}

		await this.client.makeBucket(appBucketName);
	}

	public async upload(file: Express.Multer.File, bucketName: string): Promise<{ fileName: string; url: string }> {
		return new Promise((resolve, reject) => {
			const timestamp = Date.now().toString();
			const hashedFileName = crypto.createHash('md5').update(timestamp).digest('hex');
			const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);

			// We need to append the extension at the end otherwise Minio will save it as a generic file
			const fileName = hashedFileName + extension;

			const appBucketName = this.getBucketName(bucketName);

			(async () => {
				await this.verifyBucketExistence(appBucketName);

				await this.client.putObject(appBucketName, fileName, file.buffer, {
					'Content-Type': file.mimetype,
				});

				resolve({
					fileName,
					url: `${this.env.MINIO_ENDPOINT}:${this.env.MINIO_PORT}/${appBucketName}/${fileName}`,
				});
			})().catch((error) => {
				reject(
					new HttpException(this.i18n.t('files.errors.upload.minio.generic'), HttpStatus.BAD_REQUEST, {
						cause: error,
					}),
				);
			});
		});
	}

	async get(objectName: string, bucketName: string) {
		const appBucketName = this.getBucketName(bucketName);

		try {
			return this.client.getObject(appBucketName, objectName);
		} catch (error) {
			throw new HttpException('An error occured when fetching file!', HttpStatus.BAD_REQUEST, {
				cause: error instanceof Error ? error : undefined,
			});
		}
	}

	async delete(objetName: string, bucketName: string) {
		const appBucketName = this.getBucketName(bucketName);

		try {
			return this.client.removeObject(appBucketName, objetName);
		} catch (error) {
			throw new HttpException('An error occured when deleting!', HttpStatus.BAD_REQUEST, {
				cause: error instanceof Error ? error : undefined,
			});
		}
	}
}
