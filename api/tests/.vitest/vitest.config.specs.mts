import { configDefaults, defineConfig, mergeConfig } from 'vitest/config';
import vitestBaseConfig from './base.mjs';

const specsConfigs = mergeConfig(
	vitestBaseConfig,
	defineConfig({
		test: {
			include: [...configDefaults.include],
		},
	}),
);

export default specsConfigs;
