<script lang="ts">
	import { onMount } from 'svelte';

	let count = 0;

	export let name: string = 'set something you fool';

	onMount(() => {
		const interval = setInterval(() => count++, 1000);

		return () => clearInterval(interval);
	});
</script>

<p>Counter named "{name}" has been open for {count} seconds.</p>
