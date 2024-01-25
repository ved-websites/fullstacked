import swc from 'unplugin-swc';
import { defineConfig, mergeConfig } from 'vitest/config';
import vitestBaseConfig, { VitePlugin } from './base';

const e2eConfigs = mergeConfig(
	vitestBaseConfig,
	defineConfig({
		plugins: [swc.vite() as VitePlugin],
		ssr: {
			noExternal: ['prisma-fixtures', 'class-importer'],
		},
		test: {
			include: ['**/*.e2e-spec.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
			poolOptions: {
				threads: {
					singleThread: true,
				},
			},
		},
	}),
);

export default e2eConfigs;
