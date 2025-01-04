import VitePluginTsConfigPaths from 'vite-tsconfig-paths';
import { ViteUserConfig, defineConfig } from 'vitest/config';
import type { CoverageV8Options } from 'vitest/node';
import { env } from '../../src/@common/configs';

const dbURL = process.env.TEST_DATABASE_URL ?? env.TEST_DATABASE_URL;

process.env.DATABASE_URL = dbURL;

type CoverageReporter = CoverageV8Options['reporter'];

const coverageReporter = (process.env.COV_REPORTER ?? 'lcov') as NonNullable<CoverageReporter>;
const coverageDirectory: string = process.env.COV_DIRECTORY ?? `./coverage`;

export type VitePlugin = NonNullable<ViteUserConfig['plugins']>[number];

const vitestBaseConfig = defineConfig({
	plugins: [VitePluginTsConfigPaths({ loose: true, root: '.' }) as VitePlugin],
	test: {
		testTimeout: 30000,
		passWithNoTests: true,
		coverage: {
			reportsDirectory: coverageDirectory,
			reporter: coverageReporter,
			clean: false,
			include: ['**/*.ts'],
			exclude: ['**/*.d.ts', 'gulpfile.ts', '**/_generated/**', '**/prisma/**', '**/dist/**', '**/fixtures/**'],
		},
		setupFiles: ['./tests/.vitest/setup/base.setup.ts'],
	},
});

export default vitestBaseConfig;
