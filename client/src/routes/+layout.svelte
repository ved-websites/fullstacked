<script lang="ts">
	import '../app.postcss';

	import type { AppPageData } from '$/app.d';
	import LayoutAlert from '$/lib/components/LayoutAlert/LayoutAlert.svelte';
	import ToastManager from '$/lib/components/ToastManager/ToastManager.svelte';
	import HasJs from '$/lib/components/head/HasJS.svelte';
	import InitialTheme from '$/lib/components/head/InitialTheme.svelte';
	import { layoutAlertStore, themeStore, toastsStore } from '$/lib/stores';
	import { page } from '$app/stores';
	import Navbar from '$lib/components/nav/Navbar.svelte';

	export let data;

	$: themeStore.set(data.theme ?? null);

	$: layoutAlert = ($page.form?.layoutAlert as AppPageData['layoutAlert']) || $page.data.layoutAlert || $layoutAlertStore;
	$: toasts = [...$page.data.toasts, ...(($page.form?.toasts as AppPageData['toasts']) ?? []), ...$toastsStore];
</script>

<HasJs />
<InitialTheme />

<Navbar sessionUser={data.sessionUser} />

<ToastManager data={toasts} />

<main class="container mx-auto mt-20 py-3 px-5 flex flex-col gap-3">
	<LayoutAlert data={layoutAlert} />
	<slot />
</main>
