import adapter from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';
import VitePluginRoutify from '@roxi/routify/vite-plugin';
import VitePluginTsConfigPaths from 'vite-tsconfig-paths';
import VitePluginWindicss from 'vite-plugin-windicss';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [preprocess()],

	kit: {
		adapter: adapter(),

		vite: {
			plugins: [
				VitePluginWindicss(),
				VitePluginTsConfigPaths({
					loose: true,
				}),
				VitePluginRoutify({ routesDir: 'src/pages' }),
			],
			resolve: {
				dedupe: ['svelte'],
			},

			optimizeDeps: {
				exclude: ['@urql/svelte', 'minimum-delayer'],
			},

			// @ts-ignore
			ssr: {
				noExternal: [/^@material\//, /^@smui(?:-extra)?\//],
			},
		},
	},
};

export default config;
