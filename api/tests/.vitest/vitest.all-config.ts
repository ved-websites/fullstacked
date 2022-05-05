import { defineVitestConfig } from './base';
import e2eConfigs from './vitest.e2e-config';
import specsConfigs from './vitest.specs-config';

const allConfigs = defineVitestConfig({
	plugins: [...e2eConfigs.plugins, ...specsConfigs.plugins],
	test: {
		include: [...e2eConfigs.test.include, ...specsConfigs.test.include],
	},
});

export default allConfigs;
