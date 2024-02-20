<script lang="ts">
	import { getI18n } from '$i18n';
	import Icon from '$lib/components/Icon.svelte';
	import FormInput from '$lib/components/forms/FormInput.svelte';
	import { Alert, Button, Helper } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	let i18n = getI18n();
	$: ({ t } = $i18n);

	export let data;

	const { enhance, form, constraints, errors } = superForm(data.form);

	$: isServerDown = data.sessionUser === undefined;
</script>

<form method="POST" use:enhance class="flex flex-col gap-5 w-3/4 lg:w-1/2 m-auto">
	<FormInput
		type="email"
		name="email"
		noAsterix
		placeholder={$t('(auth).login.email-placeover')}
		bind:value={$form.email}
		{...$constraints.email}
		errors={$errors.email}
	>
		{$t('(auth).login.labels.email')}
	</FormInput>

	<FormInput type="password" name="password" noAsterix bind:value={$form.password} {...$constraints.password} errors={$errors.password}>
		{$t('(auth).login.labels.password')}
	</FormInput>

	<Helper>
		<a href="/forgot_password" class="hover:underline">{$t('(auth).login.forgot.password.text')}</a>
	</Helper>

	<Button type="submit" class="mt-2" disabled={isServerDown}>{$t('common.submit')}</Button>

	{#if isServerDown}
		<Alert color="red" class="flex items-center">
			<Icon class="i-mdi-server-network-off" />
			<span>{$t('(auth).login.errors.server.down')}</span>
		</Alert>
	{/if}
</form>
