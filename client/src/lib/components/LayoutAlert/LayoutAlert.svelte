<script lang="ts">
	import Icon from '$/lib/components/Icon.svelte';
	import { alertColorMapping, type LayoutAlertData } from '$/lib/components/LayoutAlert/helper';
	import { Alert } from 'flowbite-svelte';

	export let data: LayoutAlertData | undefined;
</script>

{#if data}
	<Alert color={alertColorMapping[data.level]} class="mb-5 flex items-center">
		<Icon class={data.icon} />
		<span>{data.text}</span>
	</Alert>
{/if}
