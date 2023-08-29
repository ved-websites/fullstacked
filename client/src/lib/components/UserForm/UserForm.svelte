<script lang="ts" generics="T extends UserFormSchemaType">
	import { Button, Helper, Input, Label } from 'flowbite-svelte';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import type { UserFormSchemaType } from './userform.schema';

	export let superFormData: SuperForm<T>;

	$: ({ enhance, form, constraints, errors } = superFormData);
</script>

<form method="post" use:enhance {...$$restProps}>
	<div class="grid gap-3">
		<slot name="above" />

		<div class="grid gap-3 sm:grid-cols-2">
			<div>
				<Label>
					<span> First Name </span>
					<Input class="mt-2" type="text" bind:value={$form.firstName} {...$constraints.firstName} />
					{#if $errors.firstName}<Helper class="mt-2" color="red">{$errors.firstName}</Helper>{/if}
				</Label>
			</div>
			<div>
				<Label>
					<span> Last Name </span>
					<Input class="mt-2" type="text" bind:value={$form.lastName} {...$constraints.lastName} />
					{#if $errors.lastName}<Helper class="mt-2" color="red">{$errors.lastName}</Helper>{/if}
				</Label>
			</div>
		</div>

		<slot name="below" />

		<Button type="submit" class="mt-3">Submit</Button>
	</div>
</form>
