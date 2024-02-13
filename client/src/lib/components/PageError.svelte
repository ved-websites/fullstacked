<script lang="ts">
	import { page } from '$app/stores';
	import { getI18n } from '$i18n';
	import { Alert, Button } from 'flowbite-svelte';
	import Icon from './Icon.svelte';
	let i18n = getI18n();
	$: ({ t } = $i18n);

	export let icon: string;
	export let errorMessage: string;
</script>

<div class="flex flex-col self-center items-center gap-10">
	<div class="flex items-center">
		<Icon class="{icon} s-48"></Icon>
		<span class="text-lg text-center">{errorMessage}</span>
	</div>

	<slot />

	<slot name="redirect">
		{#if $page.url.pathname !== '/'}
			<Button href="/">{$t('common.errorpage.home-button')}</Button>
		{:else}
			<Alert color="yellow" class="flex flex-col gap-3 items-center">
				<span>{$t('common.errorpage.already-home.summary')}</span>
				<span>{$t('common.errorpage.already-home.detail')}</span>
			</Alert>
		{/if}
	</slot>
</div>
