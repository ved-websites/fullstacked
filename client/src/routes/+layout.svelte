<script lang="ts">
	import '../app.postcss';

	import Icon from '$/lib/components/Icon.svelte';
	import InitialTheme from '$/lib/components/head/InitialTheme.svelte';
	import { sessionToken } from '$/lib/stores';
	import { createClient } from '$/lib/urql';
	import { updateCookie } from '$/lib/utils/cookie';
	import type { LayoutAlertLevel } from '$/lib/utils/layout-alert';
	import { browser } from '$app/environment';
	import { navigating, page } from '$app/stores';
	import Navbar from '$lib/components/nav/Navbar.svelte';
	import { setContextClient } from '@urql/svelte';
	import { Alert } from 'flowbite-svelte';
	import { get } from 'svelte/store';

	export let data;

	if (browser) {
		const urql = createClient({
			requestToken() {
				return get(sessionToken);
			},
		});

		setContextClient(urql);
	}
	
	$: $navigating, updateCookie('has_js', 'true');

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
