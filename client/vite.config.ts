import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import { nodeLoaderPlugin } from '@vavite/node-loader/plugin';
import { defineConfig, loadEnv } from 'vite';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { defaultExclude } from 'vitest/config';

export default defineConfig(({ mode }) => {
	const env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };

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
					project: env.SENTRY_PROJECT,
					authToken: env.SENTRY_AUTH_TOKEN,
					sourcemaps: {
						assets: ['./.svelte-kit/*/**/*'],
						ignore: ['**/.svelte-kit/client/**/*'],
						filesToDeleteAfterUpload: ['./.svelte-kit/**/*.map'],
					},
				},
				adapter: 'vercel',
			}),
			sveltekit(),
			// @ts-expect-error Purge CSS is not properly updated
			purgeCss({
				safelist: {
					greedy: [/^mt-/],
				},
			}),
			nodeLoaderPlugin(),
		],
	};
});
