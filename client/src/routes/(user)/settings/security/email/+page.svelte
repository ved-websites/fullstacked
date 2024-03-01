<script lang="ts">
	import type { ConfirmedSessionUser } from '$auth/auth-handler.js';
	import { getI18n } from '$i18n';
	import Icon from '$lib/components/Icon.svelte';
	import FormInput from '$lib/components/forms/FormInput.svelte';
	import { getSessionUser } from '$lib/stores/index.js';
	import { flashStore } from '$lib/utils/flash.js';
	import { Alert, Button } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms';
	import type { EmailFlashProps } from './+page.server.js';
	let i18n = getI18n();
	$: ({ t } = $i18n);

	export let data;

	let sessionUser = getSessionUser<ConfirmedSessionUser>();

	let flash = flashStore<EmailFlashProps>();

	const { enhance, form, errors, constraints } = superForm(data.form);
</script>

<Alert color="blue" class="flex items-center">
	<Icon class="i-mdi-information" />
	<div class="flex flex-col gap-2">
		<span>{$t('settings.security.email.information.new-email-usage')}</span>
		<span>{$t('settings.security.email.information.confirm-email')}</span>
	</div>
</Alert>

<form method="POST" use:enhance>
	<FormInput
		type="email"
		name="email"
		placeholder={$sessionUser.email}
		bind:value={$form.email}
		{...$constraints.email}
		errors={$errors.email}
	>
		{$t('settings.security.email.action')}
	</FormInput>

	<Button type="submit" class="mt-3">{$t('common.submit')}</Button>
</form>

{#if $flash?.hasUpdatedEmail !== undefined}
	<Alert color={$flash.hasUpdatedEmail ? 'blue' : 'yellow'} class="flex items-center">
		<Icon class={$flash.hasUpdatedEmail ? 'i-mdi-information' : 'i-mdi-alert'} />
		{#if $flash.hasUpdatedEmail}
			<span>{$t('settings.security.email.update.success')}</span>
		{:else}
			<span>{$t('settings.security.email.update.error')}</span>
		{/if}
	</Alert>
{/if}
