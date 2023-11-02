<script lang="ts">
	import { getI18n } from '$i18n';
	import Icon from '$lib/components/Icon.svelte';
	import { alertColorMapping, type LayoutAlertData } from '$lib/components/LayoutAlert/helper';
	import { Alert } from 'flowbite-svelte';
	const i18n = getI18n();
	$: ({ t } = $i18n);

	export let data: LayoutAlertData | undefined;
</script>

{#if data}
	<Alert color={alertColorMapping[data.level]} class="mb-5 flex items-center">
		<Icon class={data.icon} />
		<span>{$t(data.text)}</span>
	</Alert>
{/if}
