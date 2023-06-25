<script lang="ts">
	import '../app.postcss';

	import type { LayoutAlert, LayoutAlertLevel } from '$/app';
	import Icon from '$/lib/components/Icon.svelte';
	import { createClient } from '$/lib/urql';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import InitialTheme from '$lib/InitialTheme.svelte';
	import Navbar from '$lib/components/nav/Navbar.svelte';
	import { mdiAlert, mdiHelpRhombus, mdiInformation } from '@mdi/js';
	import { setContextClient } from '@urql/svelte';
	import { Alert } from 'flowbite-svelte';

	export let data;

	if (browser) {
		const client = createClient();

		setContextClient(client);
	}

	let layoutAlert: Required<LayoutAlert> | undefined;

	$: {
		// @ts-expect-error LayoutAlert does not have required property, we force it here
		layoutAlert = $page.data.layoutAlert;

		if (layoutAlert && !layoutAlert.level) {
			layoutAlert.level = 'info';
		}

		if (layoutAlert && !layoutAlert.icon) {
			const mapping: Record<LayoutAlertLevel, string> = {
				info: mdiInformation,
				warning: mdiHelpRhombus,
				error: mdiAlert,
			};

			layoutAlert.icon = mapping[layoutAlert.level ?? 'info'];
		}
	}

	const alertColorMapping: Record<LayoutAlertLevel, Alert['$$prop_def']['color']> = {
		info: 'blue',
		warning: 'yellow',
		error: 'red',
	};
</script>

<InitialTheme />

<Navbar user={data.user} />

<main class="container mx-auto mt-20 py-3 px-5">
	{#if layoutAlert}
		<Alert color={alertColorMapping[layoutAlert.level]} class="mb-5 flex items-center">
			<Icon path={layoutAlert.icon} />
			<span>{layoutAlert.text}</span>
		</Alert>
	{/if}
	<slot />
</main>
