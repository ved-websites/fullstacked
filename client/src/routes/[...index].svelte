<script context="module" lang="ts">
	import { createClient } from '$/utils/urql';
	import { browser } from '$app/env';
	import { createRouter, Router } from '@roxi/routify';
	import type { Load } from '@sveltejs/kit';
	import { setClient } from '@urql/svelte';
	import routes from '../../.routify/routes.default';

	const router = createRouter({ routes });

	// for SSR we need to tell Sveltekit to wait for Routify to finish loading its components
	export const load: Load = async ({ url }) => {
		await router.url.replace(url.pathname + url.search + url.hash);

		return {};
	};
</script>

<script lang="ts">
	if (browser) {
		const client = createClient();

		setClient(client);
	}
</script>

<Router {router} />
