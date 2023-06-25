<script lang="ts">
	import { page } from '$app/stores';
	import { Alert, Button, Helper, Input, Label } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms/client';

	$: isRedirected = $page.url.searchParams.has('redirectTo');

	export let data;

	const { enhance, form, constraints, errors, message } = superForm(data.form);
</script>

{#if $message || isRedirected}
	<Alert color="red" class="mb-5">
		{$message || (isRedirected && 'Vous devez être connecté pour accéder à cette ressource!')}
	</Alert>
{/if}

<form method="post" use:enhance>
	<div class="gap-6 mb-6 md:grid-cols-2">
		<div>
			<Label for="email" class="mb-2">Email</Label>
			<Input let:props>
				<input {...props} type="email" name="email" placeholder="example@example.com" bind:value={$form.email} {...$constraints.email} />
			</Input>
			{#if $errors.email}<Helper color="red">{$errors.email}</Helper>{/if}
		</div>
		<div>
			<Label for="password" class="mb-2">Password</Label>
			<Input let:props>
				<input {...props} type="password" name="password" bind:value={$form.password} {...$constraints.password} />
			</Input>
			{#if $errors.password}<Helper color="red">{$errors.password}</Helper>{/if}
		</div>

		<Button type="submit" class="mt-5">Submit</Button>
	</div>
</form>
