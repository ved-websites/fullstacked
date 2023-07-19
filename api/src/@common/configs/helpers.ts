import type { DynamicModule } from '@nestjs/common';
import { TypedConfigModule, dotenvLoader, selectConfig, type DotenvLoaderOptions } from 'nest-typed-config';
import { EnvironmentConfig } from '../../env.validation';
import { CIEnvironmentConfig } from './ci-env.validation';

const isCI = process.env.CI == 'true';

export function getSchema(): typeof CIEnvironmentConfig | typeof EnvironmentConfig {
	// If GitHub Actions, use CI Env Config
	return isCI ? CIEnvironmentConfig : EnvironmentConfig;
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

	const configProviders = [...(module.providers ?? [])];

	if (isCI) {
		configProviders.push({ provide: EnvironmentConfig, useExisting: schema });
	}

	return {
		...module,
		providers: configProviders,
		exports: configProviders,
	};
}

export function selectEnvConfig(configModule: DynamicModule) {
	return selectConfig(configModule, getSchema());
}

export function createAndSelectConfig(options?: DotenvLoaderOptions) {
	const configModule = createConfigModule(options);

	return selectEnvConfig(configModule);
}
