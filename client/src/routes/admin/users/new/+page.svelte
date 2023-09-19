<script lang="ts">
	import UserForm from '$/lib/components/UserForm/UserForm.svelte';
	import { Heading, Helper, Input, Label, MultiSelect } from 'flowbite-svelte';
	import type { SelectOptionType } from 'flowbite-svelte/dist/types';
	import { superForm } from 'sveltekit-superforms/client';

	export let data;
	$: ({ roles } = data);

	const superFormData = superForm(data.form);
	const { form, constraints, errors } = superFormData;

	$: availableRoles = roles.map<SelectOptionType>((role) => ({
		name: role.text,
		value: role.text,
	}));
</script>

<Heading tag="h2">Creating New User</Heading>

<UserForm {superFormData}>
	<div slot="above">
		<div>
			<Label>
				<span> Email </span>
				<Input name="email" class="mt-2" type="email" placeholder="example@example.com" bind:value={$form.email} {...$constraints.email} />
				{#if $errors.email}<Helper class="mt-2" color="red">{$errors.email}</Helper>{/if}
			</Label>
		</div>
	</div>
	<div slot="below">
		<Label>Roles</Label>
		<MultiSelect name="roles" class="mt-2" items={availableRoles} bind:value={$form.roles} />
		{#if $errors.roles}<Helper class="mt-2" color="red">{$errors.roles}</Helper>{/if}
	</div>
</UserForm>
