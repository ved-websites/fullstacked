import type { DynamicModule } from '@nestjs/common';
import { TypedConfigModule, dotenvLoader, selectConfig, type DotenvLoaderOptions } from 'nest-typed-config';
import { EnvironmentConfig } from '../../env.validation';

export function createConfigModule(options?: DotenvLoaderOptions) {
	return TypedConfigModule.forRoot({
		isGlobal: true,
		schema: EnvironmentConfig,
		load: dotenvLoader({
			expandVariables: true,
			...options,
		}),
	});
}

export function selectEnvConfig(configModule: DynamicModule) {
	return selectConfig(configModule, EnvironmentConfig);
}

export function createAndSelectConfig(options?: DotenvLoaderOptions) {
	const configModule = createConfigModule(options);

	return selectEnvConfig(configModule);
}
