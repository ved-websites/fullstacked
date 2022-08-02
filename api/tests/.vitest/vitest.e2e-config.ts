import swc from 'unplugin-swc';
import { defineVitestConfig } from './base';

const e2eConfigs = defineVitestConfig({
	plugins: [swc.vite()],
	ssr: {
		noExternal: ['prisma-fixtures', 'class-importer'],
	},
	test: {
		include: ['**/*.e2e-spec.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		threads: false,
		isolate: false,
	},
});

export default e2eConfigs;
