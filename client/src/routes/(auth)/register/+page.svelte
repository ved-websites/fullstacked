<script lang="ts">
	import FormInput from '$lib/components/forms/FormInput.svelte';
	import { contextPublic } from '$lib/runes';
	import { Button, Heading } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { registerSchema } from './schema.js';

	let {
		i18n: { t },
	} = $derived(contextPublic());

	let { data } = $props();

	const { enhance, form, constraints, errors } = superForm(data.form, {
		validators: zod4Client(registerSchema),
	});
</script>

<Heading tag="h2">{$t('(auth).register.heading', { email: data.userEmail })}</Heading>

<form method="POST" class="mt-5 flex flex-col gap-6 mb-6 md:grid-cols-2" use:enhance>
	<FormInput type="password" name="password" bind:value={$form.password} {...$constraints.password} errors={$errors.password}>
		{$t('(auth).register.form.password')}
	</FormInput>

	<FormInput type="text" name="firstName" bind:value={$form.firstName} {...$constraints.firstName} errors={$errors.firstName}>
		{$t('(auth).register.form.firstName')}
	</FormInput>

	<FormInput type="text" name="lastName" bind:value={$form.lastName} {...$constraints.lastName} errors={$errors.lastName}>
		{$t('(auth).register.form.lastName')}
	</FormInput>

	<input type="hidden" name="registerToken" value={$form.registerToken} />

	<Button type="submit" class="mt-5">Submit</Button>
</form>
