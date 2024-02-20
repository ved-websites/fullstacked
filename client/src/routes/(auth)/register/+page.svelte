<script lang="ts">
	import { getI18n } from '$i18n';
	import FormInput from '$lib/components/forms/FormInput.svelte';
	import { Button, Heading } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import { registerSchema } from './schema.js';
	let i18n = getI18n();
	$: ({ t } = $i18n);

	export let data;

	const { enhance, form, constraints, errors } = superForm(data.form, {
		validators: registerSchema,
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
