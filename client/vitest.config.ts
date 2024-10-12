import { defaultExclude, defineConfig } from 'vitest/config';
import { buildPlugins } from './vite.config';

export default defineConfig((config) => {
	const plugins = buildPlugins(config);

	return {
		plugins,
		test: {
			exclude: [...defaultExclude, '**/*.browser.{test,spec}.{js,ts}'],
		},
	};
});
