import type { DynamicModule, Provider } from '@nestjs/common';
import { TypedConfigModule, dotenvLoader, selectConfig, type DotenvLoaderOptions } from 'nest-typed-config';
import { EnvironmentConfig } from '../../env.validation';
import { CIEnvironmentConfig } from './ci-env.validation';

export function getSchema(): typeof CIEnvironmentConfig | typeof EnvironmentConfig {
	// If GitHub Actions, use CI Env Config
	return process.env.CI == 'true' ? CIEnvironmentConfig : EnvironmentConfig;
}

export function createConfigModule(options?: DotenvLoaderOptions): DynamicModule {
	const schema = getSchema();

	const module = TypedConfigModule.forRoot({
		isGlobal: true,
		schema,
		load: dotenvLoader({
			expandVariables: true,
			...options,
		}),
	});

	const envConfig: Provider = {
		provide: EnvironmentConfig,
		useClass: schema,
	};

	return {
		...module,
		providers: [...(module.providers ?? []), envConfig],
		exports: [...(module.exports ?? []), envConfig],
	};
}

export function selectEnvConfig(configModule: DynamicModule) {
	return selectConfig(configModule, getSchema());
}

export function createAndSelectConfig(options?: DotenvLoaderOptions) {
	const configModule = createConfigModule(options);

	return selectEnvConfig(configModule);
}
