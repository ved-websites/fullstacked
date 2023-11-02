<script lang="ts">
	import { browser } from '$app/environment';
	import { getI18n } from '$i18n';
	import { twMerge } from '$lib/twMerge';
	import { Toast } from 'flowbite-svelte';
	import { onDestroy } from 'svelte';
	import Icon from '../Icon.svelte';
	import { toastBorderColorMapping, toastColorMapping, type ToastData } from './helper';
	const i18n = getI18n();
	$: ({ t } = $i18n);

	const toastOffTimeout = 500;

	export let data: ToastData[];

	$: data.forEach((toast) => {
		if (toasts.some((existingToast) => toast.id === existingToast.id)) {
			return;
		}

		toast.text = t.get(toast.text);

		toasts = [...toasts, toast];
	});

	$: toasts.forEach((toast) => {
		if (!browser || toast.timeoutId !== undefined || !toast.timeout) {
			return;
		}

		toast.timeoutId = setTimeout(() => {
			toast.open = false;
			toasts = [...toasts];
			setTimeout(() => {
				toast.markedForDeletion = true;
				toasts = toasts.filter((toast) => !toast.markedForDeletion);
			}, toastOffTimeout);
		}, toast.timeout);
	});

	let toasts: ToastData[] = [];

	onDestroy(() => {
		toasts.forEach((toast) => {
			clearTimeout(toast.timeoutId);
		});
	});
</script>

{#if toasts.length}
	<div class="toast-manager">
		{#each toasts as toast (toast.id)}
			<Toast
				bind:open={toast.open}
				color={toastColorMapping[toast.type]}
				class={twMerge('border-b-2', toastBorderColorMapping[toast.type], toast.classes)}
			>
				<svelte:fragment slot="icon">
					{#if toast.icon}
						<Icon class={toast.icon} />
					{/if}
				</svelte:fragment>
				{toast.text}
			</Toast>
		{/each}
	</div>
{/if}

<style lang="postcss">
	div.toast-manager {
		position: fixed;
		right: 1rem;

		display: flex;
		flex-direction: column;
		gap: 1rem;

		z-index: 90000;
	}
</style>
