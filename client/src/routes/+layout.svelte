<script lang="ts">
	import '../app.postcss';

	import type { PageMessages } from '$app-types';
	import { page } from '$app/stores';
	import { i18nContextKey } from '$i18n';
	import LayoutAlert from '$lib/components/LayoutAlert/LayoutAlert.svelte';
	import ToastManager from '$lib/components/ToastManager/ToastManager.svelte';
	import HasJs from '$lib/components/head/HasJS.svelte';
	import InitialTheme from '$lib/components/head/InitialTheme.svelte';
	import Navbar from '$lib/components/nav/Navbar.svelte';
	import { themeStore } from '$lib/stores';
	import { setContext } from 'svelte';
	import { getFlash } from 'sveltekit-flash-message/client';

	export let data;

	$: flash = getFlash(page);

	$: setContext(i18nContextKey, data.i18n);

	$: themeStore.set(data.theme ?? null);

	$: formData = $page.form as PageMessages | undefined;

	$: layoutAlert = $flash?.layoutAlert || $page.data.layoutAlert;
	$: toasts = [...($page.data.toasts ?? []), ...($flash?.toasts ?? []), ...(formData?.toasts ?? [])];
</script>

<HasJs />
<InitialTheme />

<Navbar sessionUser={data.sessionUser} />

<ToastManager data={toasts} t={data.i18n.t} />

<main class="container mx-auto mt-20 py-3 px-5 flex flex-col gap-3">
	<LayoutAlert data={layoutAlert} t={data.i18n.t} />
	<slot />
</main>
