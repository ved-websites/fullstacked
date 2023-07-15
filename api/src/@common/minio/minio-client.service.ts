import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { MinioService } from 'nestjs-minio-client';
import type { EnvironmentConfig } from '~/env.validation';
import type { BufferedFile } from './file.model';

@Injectable()
export class MinioClientService {
	constructor(
		private readonly minio: MinioService,
		private readonly env: EnvironmentConfig,
	) {
		this.logger = new Logger('MinioService');
	}

	private readonly logger: Logger;

	public get client() {
		return this.minio.client;
	}

	private getBucketName(bucketName: string) {
		return `${this.env.MINIO_BUCKET_PREFIX}-${bucketName}`;
	}

	public async upload(file: BufferedFile, bucketName: string) {
		const timestamp = Date.now().toString();
		const hashedFileName = crypto.createHash('md5').update(timestamp).digest('hex');
		const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);

		// We need to append the extension at the end otherwise Minio will save it as a generic file
		const fileName = hashedFileName + extension;

		const appBucketName = this.getBucketName(bucketName);

		try {
			await this.client.putObject(appBucketName, fileName, file.buffer, {
				'Content-Type': file.mimetype,
			});
		} catch (error) {
			throw new HttpException('Error uploading file!', HttpStatus.BAD_REQUEST, {
				cause: error instanceof Error ? error : undefined,
			});
		}

		return {
			url: `${this.env.MINIO_ENDPOINT}:${this.env.MINIO_PORT}/${appBucketName}/${fileName}`,
		};
	}

	async delete(objetName: string, bucketName: string) {
		const appBucketName = this.getBucketName(bucketName);

		try {
			return await this.client.removeObject(appBucketName, objetName);
		} catch (error) {
			throw new HttpException('An error occured when deleting!', HttpStatus.BAD_REQUEST, {
				cause: error instanceof Error ? error : undefined,
			});
		}
	}
}
