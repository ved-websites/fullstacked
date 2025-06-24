<script lang="ts">
	import { page } from '$app/stores';
	import { getI18n } from '$i18n';
	import PageError from '$lib/components/PageError.svelte';
	import { P } from 'flowbite-svelte';
	let i18n = getI18n();
	$: ({ t } = $i18n);

	$: pathTo = $page.url.searchParams.get('pathTo');
</script>

<PageError icon="i-mdi-hand-front-left" errorMessage={$t('(auth).no-access.error')}>
	<P>{@html $t('(auth).no-access.summary', { resource: `<span class="italic">${pathTo}</span>` })}</P>
</PageError>
