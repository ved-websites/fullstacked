<script lang="ts">
	import '../app.postcss';

	import Icon from '$/lib/components/Icon.svelte';
	import { createClient } from '$/lib/urql';
	import type { LayoutAlertLevel } from '$/lib/utils/layout-alert';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import InitialTheme from '$lib/InitialTheme.svelte';
	import Navbar from '$lib/components/nav/Navbar.svelte';
	import { setContextClient } from '@urql/svelte';
	import { Alert } from 'flowbite-svelte';

	export let data;

	if (browser) {
		const urql = createClient();

		setContextClient(urql);
	}

	$: layoutAlert = $page.data.layoutAlert;

	const alertColorMapping: Record<LayoutAlertLevel, Alert['$$prop_def']['color']> = {
		info: 'blue',
		warning: 'yellow',
		error: 'red',
	};
</script>

<InitialTheme />

<Navbar sessionUser={data.sessionUser} />

<main class="container mx-auto mt-20 py-3 px-5">
	{#if layoutAlert}
		<Alert color={alertColorMapping[layoutAlert.level]} class="mb-5 flex items-center">
			<Icon path={layoutAlert.icon} />
			<span>{layoutAlert.text}</span>
		</Alert>
	{/if}
	<slot />
</main>
