<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { StatusCodes } from 'http-status-codes';
	import { onMount } from 'svelte';

	function updatei18n() {
		if (page.status == StatusCodes.NOT_FOUND) {
			// Workaround to correctly update i18n when on 404 page
			location.reload();
		} else {
			invalidateAll();
		}
	}

	onMount(() => {
		addEventListener('languagechange', updatei18n);

		return () => {
			removeEventListener('languagechange', updatei18n);
		};
	});
</script>
