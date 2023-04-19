import deepmerge from 'deepmerge';
import VitePluginTsConfigPaths from 'vite-tsconfig-paths';
import type { CoverageC8Options } from 'vitest';
import { UserConfig } from 'vitest/config';
import { env } from '../../src/@common/configs';

const dbURL = process.env.TEST_DATABASE_URL ?? env.TEST_DATABASE_URL;
process.env.DATABASE_URL = dbURL;

type CoverageReporter = CoverageC8Options['reporter'];

const coverageReporter = (process.env.COV_REPORTER ?? 'lcov') as NonNullable<CoverageReporter>;
const coverageDirectory: string = process.env.COV_DIRECTORY ?? `./coverage`;

function defineConfig<T extends UserConfig>(config: T): T {
	return config;
}

const vitestBaseConfig = defineConfig({
	plugins: [
		// @ts-ignore
		VitePluginTsConfigPaths({ loose: true }),
	],
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

export function defineVitestConfig<T extends UserConfig>(config: T): T & typeof vitestBaseConfig {
	return deepmerge<T, typeof vitestBaseConfig>(config, vitestBaseConfig);
}

export default vitestBaseConfig;
