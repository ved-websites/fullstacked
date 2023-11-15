<script lang="ts">
	import { page } from '$app/stores';
	import { getI18n } from '$i18n';
	import Icon from '$lib/components/Icon.svelte';
	import { Alert, Button, P } from 'flowbite-svelte';
	import { StatusCodes } from 'http-status-codes';
	let i18n = getI18n();
	$: ({ t } = $i18n);
</script>

<div class="flex flex-col self-center items-center gap-10">
	<!-- <P>Oh no, something wrong happened!</P>

	<P>{$page.status}: {$page.error?.message}</P> -->

	{#if $page.status == StatusCodes.NOT_FOUND}
		<div class="flex items-center">
			<Icon class="i-mdi-emoticon-sad-outline s-48"></Icon>
			<span class="text-lg text-center">{$t('common.errorpage.types.404.summary')}</span>
		</div>

		<P>{@html $t('common.errorpage.types.404.explanation', { pathname: `<span class="italic">${$page.url.pathname}</span>` })}</P>
	{:else if $page.status.toString().startsWith('5')}
		<div class="flex items-center">
			<Icon class="i-mdi-server-network-off s-48"></Icon>
			<span class="text-lg text-center">
				{$t('common.errorpage.types.server.summary', { errorCode: $page.status, errorMessage: $page.error?.message })}
			</span>
		</div>

		{@const statusDetailsKey = `common.errorpage.types.server.details.${$page.status}`}
		{@const statusDetail = $t(statusDetailsKey)}

		<span>{statusDetail !== statusDetailsKey ? statusDetail : $t(`common.errorpage.types.server.details.default`)}</span>
	{/if}

	{#if $page.url.pathname !== '/'}
		<Button href="/">{$t('common.errorpage.home-button')}</Button>
	{:else}
		<Alert color="yellow" class="flex flex-col gap-3 items-center">
			<span>{$t('common.errorpage.already-home.summary')}</span>
			<span>{$t('common.errorpage.already-home.detail')}</span>
		</Alert>
	{/if}
</div>
