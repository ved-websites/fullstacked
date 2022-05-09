import deepmerge from 'deepmerge';
import VitePluginTsConfigPaths from 'vite-tsconfig-paths';
import { defineConfig, UserConfig } from 'vitest/config';
import { env } from '../../src/@common/configs';

const dbURL = process.env.TEST_DATABASE_URL ?? env.TEST_DATABASE_URL;
process.env.DATABASE_URL = dbURL;

type CoverageReporter = UserConfig['test']['coverage']['reporter'];

const coverageReporter: CoverageReporter = (process.env.COV_REPORTER as CoverageReporter) ?? 'lcov';
const coverageDirectory: string = process.env.COV_DIRECTORY ?? `./coverage`;

const vitestBaseConfig = defineConfig({
	plugins: [VitePluginTsConfigPaths({ loose: true })],
	test: {
		testTimeout: 30000,
		passWithNoTests: true,
		coverage: {
			reportsDirectory: coverageDirectory,
			reporter: coverageReporter,
			clean: false,
			include: ['**/*.ts'],
			exclude: ['**/*.d.ts', '.graphqlrc.ts', 'gulpfile.ts', '**/_generated/**', '**/prisma/**', '**/dist/**', '**/fixtures/**'],
		},
	},
});

export function defineVitestConfig<T extends ReturnType<typeof defineConfig>>(config: T): T & typeof vitestBaseConfig {
	return deepmerge(config, vitestBaseConfig) as T & typeof vitestBaseConfig;
}

export default vitestBaseConfig;
