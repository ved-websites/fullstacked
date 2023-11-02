<script lang="ts">
	import ValidationErrors from '$lib/components/ValidationErrors.svelte';
	import { Alert, Button, Heading, Input, Label } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms/client';

	export let data;

	const { enhance, form, constraints, errors, message } = superForm(data.form, { dataType: 'json' });
</script>

{#if $message}
	<Alert color="red" class="mb-5">
		{$message}
	</Alert>
{/if}

<Heading tag="h2">Welcome, {data.userEmail}!</Heading>

<form method="post" class="mt-5" use:enhance>
	<div class="gap-6 mb-6 md:grid-cols-2">
		<div>
			<Label for="password" class="mb-2">Create your new Password</Label>
			<Input let:props>
				<input {...props} type="password" name="password" bind:value={$form.password} {...$constraints.password} />
			</Input>
			<ValidationErrors errors={$errors.password} />
		</div>
		<div>
			<Label for="firstName" class="mb-2">What is your first name?</Label>
			<Input let:props>
				<input {...props} type="text" name="firstName" bind:value={$form.firstName} {...$constraints.firstName} />
			</Input>
			<ValidationErrors errors={$errors.firstName} />
		</div>
		<div>
			<Label for="lastName" class="mb-2">What is your last name?</Label>
			<Input let:props>
				<input {...props} type="text" name="lastName" bind:value={$form.lastName} {...$constraints.lastName} />
			</Input>
			<ValidationErrors errors={$errors.lastName} />
		</div>

		<Button type="submit" class="mt-5">Submit</Button>
	</div>
</form>
