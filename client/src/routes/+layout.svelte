<script lang="ts">
	import '../app.postcss';

	import InitialTheme from '$lib/InitialTheme.svelte';
	import Navbar from '$lib/components/nav/Navbar.svelte';

	// export let data;

	// $: ({ session } = data);

	// onMount(() => {
	// 	const {
	// 		data: { subscription },
	// 	} = supabase.auth.onAuthStateChange((_event, _session) => {
	// 		if (_session?.expires_at !== session?.expires_at) {
	// 			invalidate('supabase:auth');
	// 		}
	// 	});

	// 	return () => subscription.unsubscribe();
	// });
</script>

<InitialTheme />

<!-- <Navbar {session} /> -->
<Navbar session={null} />

<main class="container mx-auto mt-20 py-3 px-5">
	<slot />
</main>
