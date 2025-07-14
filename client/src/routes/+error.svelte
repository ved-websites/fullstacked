<script lang="ts">
	import { page } from '$app/state';
	import PageError from '$lib/components/PageError.svelte';
	import { contextPublic } from '$lib/runes';
	import { P } from 'flowbite-svelte';
	import { StatusCodes } from 'http-status-codes';

	let {
		i18n: { t },
	} = contextPublic();
</script>

{#if page.status == StatusCodes.NOT_FOUND}
	<PageError icon="i-mdi-select-search" errorMessage={$t('common.errorpage.types.404.summary')}>
		<P>{@html $t('common.errorpage.types.404.explanation', { pathname: `<span class="italic">${page.url.pathname}</span>` })}</P>
	</PageError>
{:else if page.status.toString().startsWith('5')}
	<PageError
		icon="i-mdi-server-network-off"
		errorMessage={$t('common.errorpage.types.server.summary', { errorCode: page.status, errorMessage: page.error?.message })}
	>
		{@const statusDetailsKey = `common.errorpage.types.server.details.${page.status}`}
		{@const statusDetail = $t(statusDetailsKey)}

		<span>{statusDetail !== statusDetailsKey ? statusDetail : $t(`common.errorpage.types.server.details.default`)}</span>
	</PageError>
{:else}
	<PageError
		icon="i-mdi-emoticon-sad-outline"
		errorMessage={page.error?.message ?? 'Unknown error'}
		i18nPayload={page.error?.i18nPayload}
	/>
{/if}
