<script lang="ts">
	import type { Role } from '$/graphql/@generated';
	import { Button, Heading, Helper, Input, Label, MultiSelect } from 'flowbite-svelte';
	import type { SelectOptionType } from 'flowbite-svelte/dist/types';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import type { userFormSchema } from './userform.schema';

	export let headerText: string;
	export let superFormData: SuperForm<typeof userFormSchema>;
	export let roles: Pick<Role, 'id' | 'text'>[];

	$: ({ enhance, form, constraints, errors } = superFormData);

	$: availableRoles = roles.map<SelectOptionType>((role) => ({
		name: role.text,
		value: role.text,
	}));
</script>

<Heading tag="h2">{headerText}</Heading>

<form method="post" enctype="multipart/form-data" use:enhance>
	<div class="grid gap-3">
		<slot name="above" />

		<div>
			<Label>
				<span> Email </span>
				<Input class="mt-2" type="email" placeholder="example@example.com" bind:value={$form.email} {...$constraints.email} />
				{#if $errors.email}<Helper class="mt-2" color="red">{$errors.email}</Helper>{/if}
			</Label>
		</div>
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
		<div>
			<Label>Roles</Label>
			<MultiSelect class="mt-2" items={availableRoles} bind:value={$form.roles} />
			{#if $errors.roles}<Helper class="mt-2" color="red">{$errors.roles}</Helper>{/if}
		</div>

		<slot name="below" />

		<Button type="submit" class="mt-5">Submit</Button>
	</div>
</form>
