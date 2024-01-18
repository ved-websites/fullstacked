import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';
import path from 'path';

/** @type {NonNullable<import('@sveltejs/kit').Config['kit']>['alias']} */
const apiAliases = {
	'~shared': '../api/src/@shared',
	'~contract': '../api/src/@contract',
	'$prisma-client': '../api/src/_generated/prisma/client',
	$zod: '../api/src/_generated/zod',
};

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
			...apiAliases,
		},
	},
};

export default config;
