<script lang="ts" context="module">
	export const meta: SettingsRouteMeta = {
		icon: 'i-mdi-security',
	};
</script>

<script lang="ts">
	import { getI18n } from '$i18n';
	import FormInput from '$lib/components/forms/FormInput.svelte';
	import { Button } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { SettingsRouteMeta } from '../types.js';
	let i18n = getI18n();
	$: ({ t } = $i18n);

	export let data;

	const { form, errors, constraints, enhance } = superForm(data.form);
</script>

<form method="POST" use:enhance class="grid gap-3 grid-cols-1 sm:grid-cols-2">
	<FormInput type="password" name="password" bind:value={$form.password} {...$constraints.password} errors={$errors.password}>
		{$t('settings.security.labels.new-password.password')}
	</FormInput>

	<FormInput type="password" name="confirm" bind:value={$form.confirm} {...$constraints.confirm} errors={$errors.confirm}>
		{$t('settings.security.labels.new-password.confirmation')}
	</FormInput>

	<Button type="submit" class="mt-3 col-span-1 sm:col-span-2">{$t('common.submit')}</Button>
</form>
