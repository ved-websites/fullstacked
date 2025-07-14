<script lang="ts" generics="V extends InputValue | null = InputValue | null">
	import { Input, Label, type InputValue } from 'flowbite-svelte';
	import type { ComponentProps, Snippet } from 'svelte';
	import ValidationErrors from './ValidationErrors.svelte';

	interface Props {
		value: V;
		errors: ComponentProps<typeof ValidationErrors>['errors'];
		noAsterix?: boolean;
		children?: Snippet;
		input?: Snippet<[{ value: V }]>;
		[key: string]: any;
	}

	let { value = $bindable(), errors, noAsterix = false, children, input, ...rest }: Props = $props();

	let inputValue = $state(value ?? undefined);

	$effect(() => {
		value = (inputValue ?? undefined) as V;
	});

	let isRequired = $derived(!noAsterix && 'required' in rest);
</script>

<Label>
	<span>
		{@render children?.()}
		{#if isRequired}
			<span class="text-red-500">*</span>
		{/if}
	</span>
	{#if input}
		{@render input({ value })}
	{:else}
		<Input class="mt-2" color={errors ? 'red' : 'default'} bind:value={inputValue} {...rest} />
	{/if}
	<ValidationErrors {errors} />
</Label>
