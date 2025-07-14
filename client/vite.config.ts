import type * as EnvPrivate from '$env/static/private';
import type * as EnvPublic from '$env/static/public';
import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { nodeLoaderPlugin } from '@vavite/node-loader/plugin';
import { defineConfig, loadEnv } from 'vite';
import { defaultExclude } from 'vitest/config';

export default defineConfig(({ mode }) => {
	const env = { ...process.env, ...loadEnv(mode, process.cwd(), '') } as typeof EnvPrivate & typeof EnvPublic;

	return {
		server: {
			strictPort: true,
			proxy: {
				'/api': {
					target: env.PUBLIC_API_ADDR,
					changeOrigin: false,
					rewrite: (path) => path.replace(/^\/api/, ''),
					ws: true,
					secure: false,
				},
			},
		},
		build: {
			sourcemap: true,
			minify: false,
		},
		test: {
			exclude: [...defaultExclude, '**/*.browser.{test,spec}.{js,ts}'],
		},
		plugins: [
			sentrySvelteKit({
				sourceMapsUploadOptions: {
					org: env.SENTRY_ORG,
					project: `${env.SENTRY_PROJECT}-frontend`,
					authToken: env.SENTRY_AUTH_TOKEN,
					sourcemaps: {
						assets: ['./.svelte-kit/*/**/*'],
						ignore: ['**/.svelte-kit/client/**/*'],
					},
				},
				adapter: 'vercel',
			}),
			tailwindcss(),
			sveltekit(),
			nodeLoaderPlugin(),
		],
		optimizeDeps: {
			include: ['flowbite-svelte', 'zod'],
		},
	};
});
