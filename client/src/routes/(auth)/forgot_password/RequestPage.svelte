<script lang="ts">
	import { getI18n } from '$i18n';
	import ValidationErrors from '$lib/components/ValidationErrors.svelte';
	import { Alert, Button, Heading, Input, Label, P } from 'flowbite-svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import type { requestPasswordSchema } from './schemas';
	const i18n = getI18n();
	$: ({ t } = $i18n);

	export let sForm: SuperValidated<typeof requestPasswordSchema>;
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

	<form method="post" action="?/requestPasswordReset" use:enhance class="flex flex-col gap-5">
		<div>
			<Label for="email">
				{$t('(auth).forgot_password.request.labels.email')}
				<Input let:props class="mt-2">
					<input
						{...props}
						type="email"
						name="email"
						placeholder={$t('(auth).login.email-placeover')}
						bind:value={$form.email}
						{...$constraints.email}
					/>
				</Input>
			</Label>

			<ValidationErrors errors={$errors.email} />
		</div>

		<Button type="submit" class="mt-2">{$t('common.submit')}</Button>
	</form>
</div>
