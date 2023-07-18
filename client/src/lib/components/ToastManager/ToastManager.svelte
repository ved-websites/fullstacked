<script lang="ts">
	import { Toast } from 'flowbite-svelte';
	import Icon from '../Icon.svelte';
	import { toastColorMapping, type ToastManagerData } from './helper';
	
	export let data: ToastManagerData[];
</script>

{#each data as toast}
	<Toast color={toastColorMapping[toast.type]} class="{toast.classes ? toast.classes : ''}">
		{#if toast.icon}
			<Icon slot="icon" path={toast.icon} />
		{/if}
		{toast.text}
	</Toast>
{/each}
