<script lang="ts">
	import '../app.postcss';

	import LayoutAlert from '$/lib/components/LayoutAlert/LayoutAlert.svelte';
	import ToastManager from '$/lib/components/ToastManager/ToastManager.svelte';
	import InitialTheme from '$/lib/components/head/InitialTheme.svelte';
	import { sessionToken, themeStore } from '$/lib/stores';
	import { createClient } from '$/lib/urql';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import Navbar from '$lib/components/nav/Navbar.svelte';
	import { setContextClient } from '@urql/svelte';
	import { get } from 'svelte/store';
	import type { PageData } from './$types.js';

	export let data;

	if (browser) {
		const urql = createClient({
			requestToken() {
				return get(sessionToken);
			},
		});

		setContextClient(urql);
	}

	$: themeStore.set(data.theme ?? null);

	$: layoutAlert = ($page.form?.layoutAlert as PageData['layoutAlert']) || $page.data.layoutAlert;
	$: toasts = [...$page.data.toasts, ...(($page.form?.toasts as PageData['toasts']) ?? [])];
</script>

<InitialTheme />

<Navbar sessionUser={data.sessionUser} />

<ToastManager data={toasts} />

<main class="container mx-auto mt-20 py-3 px-5 flex flex-col gap-3">
	<LayoutAlert data={layoutAlert} />
	<slot />
</main>
