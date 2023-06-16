import { defineConfig, defaultExclude } from 'vitest/config';
import { plugins, optimizeDeps } from './vite.config';

export default defineConfig({
	plugins,
	optimizeDeps,
	test: {
		exclude: [...defaultExclude, '**/*.browser.{test,spec}.{js,ts}'],
	},
});
