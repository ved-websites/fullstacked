/* eslint-disable @typescript-eslint/ban-ts-comment */

import { sveltekit } from '@sveltejs/kit/vite';
import { nodeLoaderPlugin } from '@vavite/node-loader/plugin';
import houdini from 'houdini/vite';
import { defineConfig, type UserConfig } from 'vite';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';

export const plugins: UserConfig['plugins'] = [
	// @ts-ignore Ignoring plugin version incompat
	houdini(),
	sveltekit(),
	purgeCss(),
	nodeLoaderPlugin(),
];

export default defineConfig({
	server: {
		strictPort: true,
	},
	plugins,
});
