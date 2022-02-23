<script context="module" lang="ts">
	import { Router, createRouter } from '@roxi/routify';
	import routes from '../../.routify/routes.default';
	import type { Load } from '@sveltejs/kit';

	const router = createRouter({ routes });

	// for SSR we need to tell Sveltekit to wait for Routify to finish loading its components
	export const load: Load = async ({ url }) => {
		await router.url.replace(url.pathname);

		return {};
	};
</script>

<script lang="ts">
	import { setClient } from '@urql/svelte';
	import { browser } from '$app/env';
	import { createClient } from '$/utils/urql';

	if (browser) {
		const client = createClient();

		setClient(client);
	}
</script>

<Router {router} />
