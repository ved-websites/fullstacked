<script lang="ts">
	import { contextPublic } from '$lib/runes';
	import { P } from 'flowbite-svelte';

	let {
		i18n: { t },
	} = $derived(contextPublic());
</script>

<P>{$t('about.main')}</P>
