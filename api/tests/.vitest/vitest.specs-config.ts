import { configDefaults } from 'vitest/config';
import { defineVitestConfig } from './base';

const specsConfigs = defineVitestConfig({
	test: {
		include: [...configDefaults.include],
	},
});

export default specsConfigs;
