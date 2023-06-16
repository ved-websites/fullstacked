import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type UserConfig } from 'vite';
import { nodeLoaderPlugin } from '@vavite/node-loader/plugin';
import VitePluginTsConfigPaths from 'vite-tsconfig-paths';

export const plugins: UserConfig['plugins'] = [
	sveltekit(),
	VitePluginTsConfigPaths({
		loose: true,
	}),
	nodeLoaderPlugin(),
];

export const optimizeDeps: UserConfig['optimizeDeps'] = {
	exclude: ['@urql/svelte'],
};

export default defineConfig({
	server: {
		strictPort: true,
	},
	plugins,
	optimizeDeps,
});
