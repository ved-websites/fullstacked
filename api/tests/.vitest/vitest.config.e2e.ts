import swc from 'unplugin-swc';
import { UserConfig } from 'vitest/config';
import { defineVitestConfig } from './base';

const e2eConfigs = defineVitestConfig({
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
		isolate: false,
	},
} satisfies UserConfig);

export default e2eConfigs;
