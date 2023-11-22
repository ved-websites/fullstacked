<script lang="ts">
	import { page } from '$app/stores';
	import { getI18n } from '$i18n';
	import PageError from '$lib/components/PageError.svelte';
	import { P } from 'flowbite-svelte';
	import { StatusCodes } from 'http-status-codes';
	let i18n = getI18n();
	$: ({ t } = $i18n);
</script>

{#if $page.status == StatusCodes.NOT_FOUND}
	<PageError icon="i-mdi-emoticon-sad-outline" errorMessage={$t('common.errorpage.types.404.summary')}>
		<P>{@html $t('common.errorpage.types.404.explanation', { pathname: `<span class="italic">${$page.url.pathname}</span>` })}</P>
	</PageError>
{:else if $page.status.toString().startsWith('5')}
	<PageError
		icon="i-mdi-server-network-off"
		errorMessage={$t('common.errorpage.types.server.summary', { errorCode: $page.status, errorMessage: $page.error?.message })}
	>
		{@const statusDetailsKey = `common.errorpage.types.server.details.${$page.status}`}
		{@const statusDetail = $t(statusDetailsKey)}

		<span>{statusDetail !== statusDetailsKey ? statusDetail : $t(`common.errorpage.types.server.details.default`)}</span>
	</PageError>
{/if}
