import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { FileUpload } from 'graphql-upload/Upload.js';
import { MinioService } from 'nestjs-minio-client';
import { EnvironmentConfig } from '~/env.validation';
import { GRAPHQL_MAX_FILE_COUNT, GRAPHQL_MAX_FILE_SIZE_MB } from './minio-client.module';

@Injectable()
export class MinioClientService {
	private readonly logger = new Logger(MinioClientService.name);

	constructor(
		private readonly minio: MinioService,
		private readonly env: EnvironmentConfig,
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

	public async upload(file: FileUpload, bucketName: string) {
		const fileStream = (() => {
			try {
				return file.createReadStream();
			} catch (error) {
				throw new HttpException(
					`Invalid file! Make sure that you are sending less than ${GRAPHQL_MAX_FILE_COUNT} files and that the files are less than ${GRAPHQL_MAX_FILE_SIZE_MB} MB.`,
					HttpStatus.BAD_REQUEST,
					{
						cause: error,
					},
				);
			}
		})();

		const timestamp = Date.now().toString();
		const hashedFileName = crypto.createHash('md5').update(timestamp).digest('hex');
		const extension = file.filename.substring(file.filename.lastIndexOf('.'), file.filename.length);

		// We need to append the extension at the end otherwise Minio will save it as a generic file
		const fileName = hashedFileName + extension;

		const appBucketName = this.getBucketName(bucketName);

		await this.verifyBucketExistence(appBucketName);

		try {
			await this.client.putObject(appBucketName, fileName, fileStream, {
				'Content-Type': file.mimetype,
			});
		} catch (error) {
			throw new HttpException('Error uploading file!', HttpStatus.BAD_REQUEST, {
				cause: error,
			});
		}

		return {
			fileName,
			url: `${this.env.MINIO_ENDPOINT}:${this.env.MINIO_PORT}/${appBucketName}/${fileName}`,
		};
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
