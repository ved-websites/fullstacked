<script lang="ts">
	import { page } from '$app/stores';
	import { getI18n } from '$i18n';
	import { previousPage } from '$lib/stores';
	import { reconstructUrl } from '$lib/utils/urls';
	import { Alert, Button } from 'flowbite-svelte';
	import Icon from './Icon.svelte';
	let i18n = getI18n();
	$: ({ t, tPayload } = $i18n);

	export let icon: string;
	export let errorMessage: string;
	export let i18nPayload: Record<string, unknown> | undefined = undefined;

	$: previousPageUrl = $previousPage && $previousPage !== reconstructUrl($page.url) ? $previousPage : undefined;
</script>

<div class="flex flex-col self-center items-center gap-10">
	<div class="flex gap-3 items-center flex-col sm:flex-row">
		<Icon class="{icon} s-48"></Icon>
		<span class="text-lg text-center">{$t(errorMessage, tPayload(i18nPayload))}</span>
	</div>

	<slot />

	<slot name="redirect">
		{#if previousPageUrl || $page.url.pathname !== '/'}
			<div class="flex gap-3 flex-col sm:flex-row">
				{#if previousPageUrl}
					<Button href={previousPageUrl}>{$t('common.errorpage.previous-page')}</Button>
				{/if}

				{#if $page.url.pathname !== '/'}
					<Button href="/">{$t('common.errorpage.home-button')}</Button>
				{/if}
			</div>
		{:else}
			<Alert color="yellow" class="flex flex-col gap-3 items-center">
				<span>{$t('common.errorpage.already-home.summary')}</span>
				<span>{$t('common.errorpage.already-home.detail')}</span>
			</Alert>
		{/if}
	</slot>
</div>
