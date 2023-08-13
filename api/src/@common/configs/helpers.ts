import type { DynamicModule } from '@nestjs/common';
import { TypedConfigModule, dotenvLoader, selectConfig, type DotenvLoaderOptions } from 'nest-typed-config';
import { EnvironmentConfig } from '../../env.validation';
import { LocalEnvironmentConfig } from './local-env.validation';

const isCI = process.env.CI == 'true';

const isLocal = isCI || process.env.LOCAL == 'true';

export function getSchema(): typeof LocalEnvironmentConfig | typeof EnvironmentConfig {
	// If Local (for example, GitHub Actions), use Local Env Config
	return isLocal ? LocalEnvironmentConfig : EnvironmentConfig;
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

	if (isLocal) {
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
