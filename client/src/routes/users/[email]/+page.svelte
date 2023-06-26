<script lang="ts">
	import { Alert, Button, Heading, Helper, Input, Label, MultiSelect } from 'flowbite-svelte';
	import type { SelectOptionType } from 'flowbite-svelte/dist/types.js';
	import { superForm } from 'sveltekit-superforms/client';

	export let data;

	const { enhance, form, constraints, errors, message } = superForm(data.form, { dataType: 'json' });

	let availableRoles: SelectOptionType[] = data.roles.map((role) => ({
		name: role.text,
		value: role.id,
	}));
</script>

{#if $message}
	<Alert color="red" class="mb-5">
		{$message}
	</Alert>
{/if}

<Heading tag="h2">Editing user {data.editableUser?.email}</Heading>

<form method="post" class="mt-5" use:enhance>
	<div class="gap-6 mb-6 md:grid-cols-2">
		<div>
			<Label for="email" class="mb-2">Email</Label>
			<Input let:props>
				<input {...props} type="email" name="email" placeholder="example@example.com" bind:value={$form.email} {...$constraints.email} />
			</Input>
			{#if $errors.email}<Helper color="red">{$errors.email}</Helper>{/if}
		</div>
		<div>
			<Label for="firstName" class="mb-2">First Name</Label>
			<Input let:props>
				<input {...props} type="text" name="firstName" bind:value={$form.firstName} {...$constraints.firstName} />
			</Input>
			{#if $errors.firstName}<Helper color="red">{$errors.firstName}</Helper>{/if}
		</div>
		<div>
			<Label for="lastName" class="mb-2">Last Name</Label>
			<Input let:props>
				<input {...props} type="text" name="lastName" bind:value={$form.lastName} {...$constraints.lastName} />
			</Input>
			{#if $errors.lastName}<Helper color="red">{$errors.lastName}</Helper>{/if}
		</div>
		<div>
			<Label for="roles" class="mb-2">Roles</Label>
			<MultiSelect items={availableRoles} bind:value={$form.roles} />
			{#if $errors.roles}<Helper color="red">{$errors.roles}</Helper>{/if}
		</div>

		<Button type="submit" class="mt-5">Submit</Button>
	</div>
</form>
