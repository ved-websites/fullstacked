import { dotenvLoader, selectConfig, TypedConfigModule } from 'nest-typed-config';
import { EnvironmentConfig } from './env.validation';

export const ConfigModule = TypedConfigModule.forRoot({
	isGlobal: true,
	schema: EnvironmentConfig,
	load: dotenvLoader({
		expandVariables: true,
	}),
});

export const env = selectConfig(ConfigModule, EnvironmentConfig);
