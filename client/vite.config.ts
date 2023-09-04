/* eslint-disable @typescript-eslint/ban-ts-comment */

import { sveltekit } from '@sveltejs/kit/vite';
import { nodeLoaderPlugin } from '@vavite/node-loader/plugin';
import houdini from 'houdini/vite';
import { defineConfig, type UserConfig } from 'vite';

export const plugins: UserConfig['plugins'] = [houdini(), sveltekit(), nodeLoaderPlugin()];

export default defineConfig({
	server: {
		strictPort: true,
	},
	plugins,
});
