<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { alertColorMapping, type LayoutAlertData } from '$lib/components/LayoutAlert/helper';
	import { contextPublic } from '$lib/runes';
	import { Alert } from 'flowbite-svelte';

	let {
		i18n: { t },
	} = $derived(contextPublic());

	interface Props {
		data: LayoutAlertData | null | undefined;
	}

	let { data }: Props = $props();
</script>

{#if data}
	<Alert color={alertColorMapping[data.type]} class="mb-5 flex items-center">
		<Icon class={data.icon} />
		<span>{$t(data.text, data.i18nPayload)}</span>
	</Alert>
{/if}
