import { configDefaults, type UserConfig } from 'vitest/config';
import { defineVitestConfig } from './base';

const specsConfigs = defineVitestConfig({
	test: {
		include: [...configDefaults.include],
	},
} satisfies UserConfig);

export default specsConfigs;
