<script lang="ts" module>
	export const meta: SettingsRouteMeta = {
		icon: 'i-mdi-security',
	};
</script>

<script lang="ts">
	import FormInput from '$lib/components/forms/FormInput.svelte';
	import { context } from '$lib/runes';
	import { Button, Heading } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms';
	import type { SettingsRouteMeta } from '../types.js';

	let {
		i18n: { t },
	} = context();

	let { data } = $props();

	const { form, errors, constraints, enhance } = superForm(data.form);
</script>

<div class="flex flex-col gap-10">
	<div class="flex flex-col gap-y-5">
		<Heading tag="h4">{$t('settings.security.email.header')}</Heading>
		<Button href="/settings/security/email">{$t('settings.security.email.action')}</Button>
	</div>

	<form method="POST" use:enhance class="grid gap-3 grid-cols-1 sm:grid-cols-2">
		<FormInput type="password" name="password" bind:value={$form.password} {...$constraints.password} errors={$errors.password}>
			{$t('settings.security.labels.new-password.password')}
		</FormInput>

		<FormInput type="password" name="confirm" bind:value={$form.confirm} {...$constraints.confirm} errors={$errors.confirm}>
			{$t('settings.security.labels.new-password.confirmation')}
		</FormInput>

		<Button type="submit" class="mt-3 col-span-1 sm:col-span-2">{$t('common.submit')}</Button>
	</form>
</div>
