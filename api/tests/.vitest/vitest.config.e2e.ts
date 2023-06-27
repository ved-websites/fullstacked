import swc from 'unplugin-swc';
import { defineConfig, mergeConfig } from 'vitest/config';
import vitestBaseConfig from './base';

const e2eConfigs = mergeConfig(
	vitestBaseConfig,
	defineConfig({
		plugins: [
			// @ts-ignore
			swc.vite(),
		],
		ssr: {
			noExternal: ['prisma-fixtures', 'class-importer'],
		},
		test: {
			include: ['**/*.e2e-spec.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
			threads: false,
		},
	}),
);

export default e2eConfigs;
