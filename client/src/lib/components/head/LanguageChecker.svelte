<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';

	function updatei18n() {
		invalidateAll();
	}

	onMount(() => {
		addEventListener('languagechange', updatei18n);

		return () => {
			removeEventListener('languagechange', updatei18n);
		};
	});
</script>
