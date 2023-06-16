import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'pnpm run playwright:test',
		port: 4173,
	},
	testDir: 'tests',
	outputDir: 'tests/test-results',
	use: {
		actionTimeout: 10000,
	},
	testMatch: '**/*.browser.@(spec|test).?(c|m)[jt]s?(x)',
});
