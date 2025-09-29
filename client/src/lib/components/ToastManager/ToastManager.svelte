<script lang="ts">
	import { browser } from '$app/environment';
	import { contextPublic } from '$lib/runes';
	import { cn } from '$lib/twMerge';
	import { Toast } from 'flowbite-svelte';
	import { onDestroy, untrack, type Snippet } from 'svelte';
	import Icon from '../Icon.svelte';
	import { toastBorderColorMapping, toastColorMapping, type ToastData } from './helper';

	let {
		i18n: { t },
	} = $derived(contextPublic());

	interface Props {
		data: ToastData[];
		toastIcon?: Snippet<[{ icon?: string }]>;
	}

	let { data, toastIcon }: Props = $props();

	const toastOffTimeout = 500;

	let toasts: ToastData[] = $state([]);

	onDestroy(() => {
		toasts.forEach((toast) => {
			clearTimeout(toast.timeoutId);
		});
	});

	$effect(() => {
		data.forEach((toast) => {
			const currToasts = untrack(() => toasts);
			const currToast = untrack(() => toast);

			if (currToasts.some((existingToast) => currToast.id === existingToast.id)) {
				return;
			}

			currToast.text = t.get(currToast.text, currToast.i18nPayload);

			currToasts.push(currToast);
		});
	});

	$effect(() => {
		for (const toast of toasts) {
			if (!browser || toast.timeoutId !== undefined || !toast.timeout) {
				return;
			}

			toast.timeoutId = setTimeout(() => {
				toast.open = false;

				setTimeout(() => {
					toast.markedForDeletion = true;

					toasts = toasts.filter((toast) => !toast.markedForDeletion);
				}, toastOffTimeout);
			}, toast.timeout);
		}
	});
</script>

{#if toasts.length}
	<div class="toast-manager">
		{#each toasts as toast (toast.id)}
			<Toast
				bind:toastStatus={toast.open}
				color={toastColorMapping[toast.type]}
				class={cn('border-b-2', toastBorderColorMapping[toast.type], toast.classes)}
				contentClass="w-full text-sm font-normal flex flex-col"
			>
				{#if toastIcon}
					{@render toastIcon({ icon: toast.icon })}
				{:else if toast.icon}
					<Icon class={toast.icon} />
				{/if}
				<span>{toast.text}</span>
				{#if toast.extraData}
					{@html toast.extraData}
				{/if}
			</Toast>
		{/each}
	</div>
{/if}

<style>
	div.toast-manager {
		position: fixed;
		right: 1rem;

		display: flex;
		flex-direction: column;
		gap: 1rem;

		z-index: 90000;
	}
</style>
