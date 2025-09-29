<script lang="ts">
	import FormInput from '$lib/components/forms/FormInput.svelte';
	import { contextPublic } from '$lib/runes';
	import { Alert, Button, Heading, P } from 'flowbite-svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import type { z } from 'zod/v4';
	import type { requestPasswordSchema } from './schemas';

	let {
		i18n: { t },
	} = $derived(contextPublic());

	interface Props {
		sForm: SuperValidated<z.output<typeof requestPasswordSchema>>;
		validToken?: boolean;
	}

	let { sForm, validToken = true }: Props = $props();

	const { enhance, form, constraints, errors } = superForm(sForm);
</script>

<div class="flex flex-col gap-5 sm:w-3/4 lg:w-1/2 m-auto">
	<Heading tag="h2">{$t('(auth).forgot-password.request.heading')}</Heading>

	<P>
		{$t('(auth).forgot-password.request.description')}
	</P>

	{#if !validToken}
		<Alert color="yellow">{$t('(auth).forgot-password.request.wrong_token')}</Alert>
	{/if}

	<form method="POST" action="?/requestPasswordReset" use:enhance class="flex flex-col gap-5">
		<FormInput
			type="email"
			name="email"
			placeholder={$t('(auth).forgot-password.request.email-placeover')}
			bind:value={$form.email}
			{...$constraints.email}
			errors={$errors.email}
		>
			{$t('(auth).forgot-password.request.labels.email')}
		</FormInput>

		<Button type="submit" class="mt-2">{$t('common.submit')}</Button>
	</form>
</div>
