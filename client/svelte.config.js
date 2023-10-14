import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		alias: {
			$auth: './src/auth',
			$navigation: './src/navigation',
			$routes: './src/routes',
			$houdini: path.resolve('.', '$houdini'),
			$i18n: './src/i18n/lang.ts',
			'$i18n-config': './src/i18n/translations.ts',
			'$app-types': './src/app.d.ts',
		},
	},
};

export default config;
