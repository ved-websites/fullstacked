/* eslint-disable @typescript-eslint/ban-ts-comment */

import { sveltekit } from '@sveltejs/kit/vite';
import { nodeLoaderPlugin } from '@vavite/node-loader/plugin';
import houdini from 'houdini/vite';
import { defineConfig, type UserConfig } from 'vite';
import VitePluginTsConfigPaths from 'vite-tsconfig-paths';

export const plugins: UserConfig['plugins'] = [
	VitePluginTsConfigPaths({
		loose: true,
		root: '.',
	}),
	// @ts-ignore
	houdini(),
	sveltekit(),
	nodeLoaderPlugin(),
];

export default defineConfig({
	server: {
		strictPort: true,
	},
	plugins,
});
