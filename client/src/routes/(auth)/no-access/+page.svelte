<script lang="ts">
	import { page } from '$app/state';
	import PageError from '$lib/components/PageError.svelte';
	import { contextPublic } from '$lib/runes';
	import { P } from 'flowbite-svelte';

	let {
		i18n: { t },
	} = contextPublic();

	let pathTo = $derived(page.url.searchParams.get('pathTo'));
</script>

<PageError icon="i-mdi-hand-front-left" errorMessage={$t('(auth).no-access.error')}>
	<P>{@html $t('(auth).no-access.summary', { resource: `<span class="italic">${pathTo}</span>` })}</P>
</PageError>
