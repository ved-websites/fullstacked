import { IsString } from 'class-validator';
import { EnvironmentConfig } from '../../env.validation';

export class LocalEnvironmentConfig extends EnvironmentConfig {
	@IsString()
	override readonly EMAIL_FROM: string = '';

	@IsString()
	override readonly EMAIL_ENDPOINT: string = '';

	@IsString()
	override readonly EMAIL_AUTH_KEY: string = '';
}
