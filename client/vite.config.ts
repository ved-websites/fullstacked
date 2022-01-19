import { svelte as VitePluginSvelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig, loadEnv } from 'vite';
import { injectHtml as VitePluginInjectHTML } from 'vite-plugin-html';
import { Options as VitePWAOptions, VitePWA as VitePluginPWA } from 'vite-plugin-pwa';
import VitePluginWindicss from 'vite-plugin-windicss';
import VitePluginTsConfigPaths from 'vite-tsconfig-paths';

const DEFAULT_PORT = 5000;

export default defineConfig(({ mode }) => {
	const viteEnv = loadEnv(mode, process.cwd(), '');

	const isProduction = mode === 'production';

	const port: number = parseInt(viteEnv.PORT) || DEFAULT_PORT;

	const htmlTitle = viteEnv.VITE_TITLE || 'Dev';

	const manifestOptions: VitePWAOptions['manifest'] = {
		name: viteEnv.VITE_TITLE,
		short_name: `Svelte PWA App`,
		icons: [
			{
				src: '/icons/pwa/icon-192x192.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: '/icons/pwa/icon-256x256.png',
				sizes: '256x256',
				type: 'image/png',
			},
			{
				src: '/icons/pwa/icon-384x384.png',
				sizes: '384x384',
				type: 'image/png',
			},
			{
				src: '/icons/pwa/icon-512x512.png',
				sizes: '512x512',
				type: 'image/png',
			},
		],
	};

	return {
		build: {
			// cssCodeSplit: false,
			minify: isProduction,
			sourcemap: !isProduction,
		},
		server: {
			port: port,
		},
		optimizeDeps: {
			exclude: ['@roxi/routify', '@urql/svelte'],
		},
		resolve: {
			dedupe: ['@roxi/routify'],
		},
		plugins: [
			VitePluginPWA({
				minify: !isProduction,
				manifest: manifestOptions,
			}),
			VitePluginWindicss(),
			VitePluginSvelte({
				hot: !isProduction,
			}),
			VitePluginTsConfigPaths({
				loose: true,
			}),
			VitePluginInjectHTML({
				injectData: {
					title: htmlTitle,
				},
			}),
		],
	};
});
