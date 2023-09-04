import { defaultExclude, defineConfig } from 'vitest/config';
import { plugins } from './vite.config';

export default defineConfig({
	plugins,
	test: {
		exclude: [...defaultExclude, '**/*.browser.{test,spec}.{js,ts}'],
	},
});
