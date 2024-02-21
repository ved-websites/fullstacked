<script lang="ts">
	import { getI18n } from '$i18n';
	import FormInput from '$lib/components/forms/FormInput.svelte';
	import { Alert, Button, Heading, P } from 'flowbite-svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import type { z } from 'zod';
	import type { requestPasswordSchema } from './schemas';
	let i18n = getI18n();
	$: ({ t } = $i18n);

	export let sForm: SuperValidated<z.output<typeof requestPasswordSchema>>;
	export let validToken: boolean = true;

	const { enhance, form, constraints, errors } = superForm(sForm);
</script>

<div class="flex flex-col gap-5 sm:w-3/4 lg:w-1/2 m-auto">
	<Heading tag="h2">{$t('(auth).forgot_password.request.heading')}</Heading>

	<P>
		{$t('(auth).forgot_password.request.description')}
	</P>

	{#if !validToken}
		<Alert color="yellow">{$t('(auth).forgot_password.request.wrong_token')}</Alert>
	{/if}

	<form method="POST" action="?/requestPasswordReset" use:enhance class="flex flex-col gap-5">
		<FormInput
			type="email"
			name="email"
			placeholder={$t('(auth).forgot_password.request.email-placeover')}
			bind:value={$form.email}
			{...$constraints.email}
			errors={$errors.email}
		>
			{$t('(auth).forgot_password.request.labels.email')}
		</FormInput>

		<Button type="submit" class="mt-2">{$t('common.submit')}</Button>
	</form>
</div>
