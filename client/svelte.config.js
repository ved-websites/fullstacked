import adapter from '@sveltejs/adapter-netlify';
import preprocess from 'svelte-preprocess';
import VitePluginRoutify from '@roxi/routify/vite-plugin';
import VitePluginTsConfigPaths from 'vite-tsconfig-paths';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [preprocess()],

	kit: {
		adapter: adapter(),

		vite: {
			plugins: [
				VitePluginTsConfigPaths({
					loose: true,
				}),
				VitePluginRoutify({ routesDir: 'src/pages' }),
			],
			resolve: {
				dedupe: ['svelte'],
			},

			optimizeDeps: {
				exclude: ['@urql/svelte'],
			},

			// @ts-ignore
			ssr: {
				noExternal: [/^@material\//, /^@smui(?:-extra)?\//],
			},
		},

		browser: {
			router: false,
			hydrate: true,
		},
	},
};

export default config;
