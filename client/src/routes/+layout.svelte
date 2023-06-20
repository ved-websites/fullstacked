<script lang="ts">
	import '../app.postcss';

	import { createClient } from '$/lib/urql';
	import { getCookie } from '$/lib/utils/cookie';
	import { browser } from '$app/environment';
	import InitialTheme from '$lib/InitialTheme.svelte';
	import Navbar from '$lib/components/nav/Navbar.svelte';
	import { setContextClient } from '@urql/svelte';

	if (browser) {
		const client = createClient({
			token: getCookie('authorization'),
		});

		setContextClient(client);
	}
</script>

<InitialTheme />

<!-- <Navbar {session} /> -->
<Navbar session={null} />

<main class="container mx-auto mt-20 py-3 px-5">
	<slot />
</main>
