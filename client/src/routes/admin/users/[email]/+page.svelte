<script lang="ts">
	import UserForm from '$/lib/components/UserForm/UserForm.svelte';
	import { Heading, Helper, Label, MultiSelect } from 'flowbite-svelte';
	import type { SelectOptionType } from 'flowbite-svelte/dist/types';
	import { superForm } from 'sveltekit-superforms/client';

	export let data;

	const superFormData = superForm(data.form);
	const { form, errors } = superFormData;

	$: availableRoles = data.roles.map<SelectOptionType>((role) => ({
		name: role.text,
		value: role.text,
	}));
</script>

<Heading tag="h2" class="overflow-x-clip text-ellipsis">Editing user {data.editableUser?.email}</Heading>

<UserForm {superFormData} class="col-span-2 order-1 sm:order-none">
	<div slot="below">
		<Label>Roles</Label>
		<MultiSelect name="roles" class="mt-2" items={availableRoles} bind:value={$form.roles} />
		{#if $errors.roles}<Helper class="mt-2" color="red">{$errors.roles}</Helper>{/if}
	</div>
</UserForm>
