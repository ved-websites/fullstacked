<script lang="ts">
	import { contextPublic } from '$lib/runes';
	import { cn } from '$lib/twMerge';
	import type { Snippet } from 'svelte';
	import type { HTMLSelectAttributes } from 'svelte/elements';
	import type { VSelectOptionType } from './types';

	let {
		i18n: { t },
	} = contextPublic();

	interface Props extends Omit<HTMLSelectAttributes, 'size' | 'disabled'> {
		items: VSelectOptionType[];
		value: any;
		placeholder?: string;
		underline?: boolean;
		size?: 'sm' | 'md' | 'lg';
		defaultClass?: string;
		underlineClass?: string;
		class?: string;
		emptyOptions?: Snippet;
		[key: PropertyKey]: any;
	}

	let {
		items = [],
		value = $bindable(null),
		placeholder = 'Choose option ...',
		underline = false,
		size = 'md',
		defaultClass = 'text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500',
		underlineClass = 'text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer',
		class: klass,
		emptyOptions,
		...rest
	}: Props = $props();

	const common = 'block w-full';
	const sizes = {
		sm: 'text-sm p-2',
		md: 'text-sm p-2.5',
		lg: 'text-base py-3 px-4',
	};

	let selectClass = $derived(cn(common, underline ? underlineClass : defaultClass, sizes[size], underline && '!px-0', klass));
</script>

<select {...rest} bind:value class={selectClass}>
	{#if placeholder}
		<option disabled selected={items.every((item) => !item.selected)} value="">{placeholder}</option>
	{/if}

	{#each items as { value, name, selected }}
		<option {value} {selected}>{$t(String(name))}</option>
	{:else}
		{@render emptyOptions?.()}
	{/each}
</select>

<!--
  @component
  [Go to docs](https://flowbite-svelte.com/)
  ## Props
  @prop export let items: SelectOptionType<any>[] = [];
  @prop export let value: any = undefined;
  @prop export let placeholder: string = 'Choose option ...';
  @prop export let underline: boolean = false;
  @prop export let size: 'sm' | 'md' | 'lg' = 'md';
  @prop export let defaultClass: string = 'text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500';
  @prop export let underlineClass: string = 'text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer';
  -->
