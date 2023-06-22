<script lang="ts">
	import '../app.postcss';

	import { createClient } from '$/lib/urql';
	import { browser } from '$app/environment';
	import InitialTheme from '$lib/InitialTheme.svelte';
	import Navbar from '$lib/components/nav/Navbar.svelte';
	import { setContextClient } from '@urql/svelte';

	if (browser) {
		const client = createClient({
			requestToken: () => {
				return '';
			},
		});

		setContextClient(client);
	}

	export let data;
</script>

<InitialTheme />

<Navbar user={data.user} />

<main class="container mx-auto mt-20 py-3 px-5">
	<slot />
</main>
