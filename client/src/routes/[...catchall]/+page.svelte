<script lang="ts">
	import { page } from '$app/state';
	import PageError from '$lib/components/PageError.svelte';
	import { contextPublic } from '$lib/runes';
	import { P } from 'flowbite-svelte';

	let {
		i18n: { t },
	} = $derived(contextPublic());
</script>

<PageError icon="i-mdi-select-search" errorMessage={$t('common.errorpage.types.404.summary')}>
	<P>{@html $t('common.errorpage.types.404.explanation', { pathname: `<span class="italic">${page.url.pathname}</span>` })}</P>
</PageError>
