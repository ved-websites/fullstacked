<script lang="ts">
	import { getI18n } from '$i18n';
	import ValidationErrors from '$lib/components/ValidationErrors.svelte';
	import { Button, Heading, Input, Label } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	let i18n = getI18n();
	$: ({ t } = $i18n);

	export let data;

	const { enhance, form, constraints, errors } = superForm(data.form, { dataType: 'json' });
</script>

<Heading tag="h2">{$t('(auth).register.heading', { email: data.userEmail })}</Heading>

<form method="POST" class="mt-5 flex flex-col gap-6 mb-6 md:grid-cols-2" use:enhance>
	<Label for="password">
		<span>{$t('(auth).register.form.password')}</span>
		<Input name="firstName" class="mt-2" type="password" bind:value={$form.password} {...$constraints.password} />
		<ValidationErrors errors={$errors.password} />
	</Label>
	<Label for="firstName">
		<span>{$t('(auth).register.form.firstName')}</span>
		<Input name="firstName" class="mt-2" type="text" bind:value={$form.firstName} {...$constraints.firstName} />
		<ValidationErrors errors={$errors.firstName} />
	</Label>
	<Label>
		<span>{$t('(auth).register.form.lastName')}</span>
		<Input name="lastName" class="mt-2" type="text" bind:value={$form.lastName} {...$constraints.lastName} />
		<ValidationErrors errors={$errors.lastName} />
	</Label>

	<Button type="submit" class="mt-5">Submit</Button>
</form>
