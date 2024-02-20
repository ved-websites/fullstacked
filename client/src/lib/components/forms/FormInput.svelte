<script lang="ts">
	import { Input, Label } from 'flowbite-svelte';
	import type { ComponentProps } from 'svelte';
	import ValidationErrors from './ValidationErrors.svelte';

	export let value: ComponentProps<Input>['value'];
	export let errors: ComponentProps<ValidationErrors>['errors'];

	export let noAsterix = false;

	$: isRequired = !noAsterix && 'required' in $$restProps;
</script>

<Label>
	<span>
		<slot />
		{#if isRequired}
			<span class="text-red-500">*</span>
		{/if}
	</span>
	<slot name="input" {value}>
		<Input class="mt-2" color={errors ? 'red' : 'base'} bind:value {...$$restProps} />
	</slot>
	<ValidationErrors {errors} />
</Label>
