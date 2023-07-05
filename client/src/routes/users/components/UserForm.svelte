<script lang="ts">
	import type { Role } from '$/graphql/@generated';
	import { Alert, Button, Heading, Helper, Input, Label, MultiSelect } from 'flowbite-svelte';
	import type { SelectOptionType } from 'flowbite-svelte/dist/types.js';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import type { userFormSchema } from './userform.schema';

	export let headerText: string;
	export let roles: Pick<Role, 'id' | 'text'>[];
	export let superFormData: SuperForm<typeof userFormSchema>;

	$: ({ enhance, form, constraints, errors, message } = superFormData);

	let availableRoles: SelectOptionType[] = roles.map((role) => ({
		name: role.text,
		value: role.text,
	}));
</script>

{#if $message}
	<Alert color="red" class="mb-5">
		{$message}
	</Alert>
{/if}

<Heading tag="h2">{headerText}</Heading>

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
