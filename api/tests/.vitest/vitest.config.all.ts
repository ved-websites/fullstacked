import { UserConfig } from 'vitest/config';
import { defineVitestConfig } from './base';
import e2eConfigs from './vitest.config.e2e';
import specsConfigs from './vitest.config.specs';

const allConfigs = defineVitestConfig({
	// @ts-ignore
	plugins: [...e2eConfigs.plugins, ...specsConfigs.plugins],
	ssr: e2eConfigs.ssr,
	test: {
		include: [...e2eConfigs.test.include, ...specsConfigs.test.include],
	},
} satisfies UserConfig);

export default allConfigs;
