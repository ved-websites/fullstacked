/* eslint-disable camelcase */

import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEmail, IsEnum, IsInt, IsOptional, IsString, Matches } from 'class-validator';

export function splitIntoArray(value: string) {
	return value
		.split(',')
		.filter((s) => !!s)
		.map((s) => s.trim());
}

export enum Environment {
	Development = 'development',
	Production = 'production',
	Test = 'test',
}

export const DEFAULT_PORT = 3000;

export const DEFAULT_MINIO_PORT = 9000;

export class EnvironmentConfig {
	@IsEmail()
	readonly EMAIL_FROM!: string;

	@IsString()
	readonly EMAIL_ENDPOINT!: string;

	@IsString()
	readonly EMAIL_AUTH_KEY!: string;

	@IsOptional()
	@Transform(({ value }) => value === 'true')
	@IsBoolean()
	readonly EMAIL_SENT_IN_DEV: boolean = false;

	@IsOptional()
	@IsEnum(Environment)
	readonly NODE_ENV?: Environment;

	@Type(() => Number)
	@IsInt()
	readonly PORT: number = DEFAULT_PORT;

	@IsOptional()
	@Matches(/^https?:\/\/[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*(:\d+)?$/, {
		message: `CORS_LINKS must be a string of URLs with a port, separated by commas (spaces between are allowed)`,
		each: true,
	})
	@Transform(({ value }) => splitIntoArray(value))
	readonly CORS_LINKS?: string[];

	@IsString()
	readonly KEY!: string;

	// ---------------
	//     DATABASE
	// ---------------

	@IsOptional()
	@IsString()
	readonly DB_USER?: string;

	@IsOptional()
	@IsString()
	readonly DB_PSW?: string;

	@IsOptional()
	@IsString()
	readonly DB_CONN?: string;

	@IsOptional()
	@IsString()
	readonly DB_NAME?: string;

	@IsOptional()
	@IsString()
	readonly DB_TEST_USER?: string;

	@IsOptional()
	@IsString()
	readonly DB_TEST_PSW?: string;

	@IsOptional()
	@IsString()
	readonly DB_TEST_CONN?: string;

	@IsOptional()
	@IsString()
	readonly DB_TEST_NAME?: string;

	@IsString()
	readonly DATABASE_URL!: string;

	@IsOptional()
	@IsString()
	readonly TEST_DATABASE_URL?: string;

	// ---------------
	//     Minio
	// ---------------

	@IsString()
	readonly MINIO_ENDPOINT: string = 'localhost';

	@Type(() => Number)
	@IsInt()
	readonly MINIO_PORT: number = DEFAULT_MINIO_PORT;

	@IsString()
	readonly MINIO_ACCESS_KEY: string = 'minioadmin';

	@IsString()
	readonly MINIO_SECRET_KEY: string = 'minioadmin';

	@IsString()
	readonly MINIO_BUCKET_PREFIX!: string;
}
