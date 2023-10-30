<script lang="ts">
	import type { I18nInstanceType } from '$i18n-config';
	import Icon from '$lib/components/Icon.svelte';
	import { alertColorMapping, type LayoutAlertData } from '$lib/components/LayoutAlert/helper';
	import { Alert } from 'flowbite-svelte';

	export let data: LayoutAlertData | undefined;
	export let t: I18nInstanceType['t'];
</script>

{#if data}
	<Alert color={alertColorMapping[data.level]} class="mb-5 flex items-center">
		<Icon class={data.icon} />
		<span>{$t(data.text)}</span>
	</Alert>
{/if}
