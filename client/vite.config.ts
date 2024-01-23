import { sveltekit } from '@sveltejs/kit/vite';
import { nodeLoaderPlugin } from '@vavite/node-loader/plugin';
import { defineConfig, type UserConfig } from 'vite';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';

export const plugins: UserConfig['plugins'] = [
	sveltekit(),
	purgeCss({
		safelist: {
			greedy: [/^mt-/],
		},
	}),
	nodeLoaderPlugin(),
];

export default defineConfig({
	server: {
		strictPort: true,
	},
	plugins,
});
