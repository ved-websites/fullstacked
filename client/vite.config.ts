import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import { nodeLoaderPlugin } from '@vavite/node-loader/plugin';
import { defineConfig, loadEnv, type ConfigEnv, type UserConfig } from 'vite';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';

export const buildPlugins = ({ mode }: ConfigEnv): UserConfig['plugins'] => {
	const env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };

	return [
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
		purgeCss({
			safelist: {
				greedy: [/^mt-/],
			},
		}),
		nodeLoaderPlugin(),
	];
};

export default defineConfig((config) => {
	const plugins = buildPlugins(config);

	const env = { ...process.env, ...loadEnv(config.mode, process.cwd(), '') };

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
		plugins,
		build: {
			sourcemap: true,
			minify: false,
		},
	};
});
