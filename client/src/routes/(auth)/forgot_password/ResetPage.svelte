<script lang="ts">
	import { page } from '$app/stores';
	import { getI18n } from '$i18n';
	import { createLayoutAlert, setPageLayoutAlert } from '$lib/components/LayoutAlert/helper';
	import ValidationErrors from '$lib/components/ValidationErrors.svelte';
	import { Button, Heading, Input, Label, P } from 'flowbite-svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import type { resetPasswordSchema } from './schemas';
	let i18n = getI18n();
	$: ({ t } = $i18n);

	export let sForm: SuperValidated<typeof resetPasswordSchema>;
	export let user: { email: string };

	const { enhance, form, constraints, errors } = superForm(sForm);

	$: {
		if ($errors.resetToken) {
			setPageLayoutAlert(
				createLayoutAlert({
					text: $errors.resetToken.join(' - '),
					type: 'warning',
				}),
			);
		}
	}
</script>

<div class="flex flex-col gap-5 sm:w-3/4 lg:w-1/2 m-auto">
	<Heading tag="h2">{$t('(auth).forgot_password.reset.heading')}</Heading>

	<P>
		{$t('(auth).forgot_password.reset.description', { email: user.email })}
	</P>
	<P>
		{$t('(auth).forgot_password.reset.warning')}
	</P>

	<form method="POST" action="?/resetPassword" use:enhance class="flex flex-col gap-5">
		<div>
			<Label for="password">
				{$t('(auth).forgot_password.reset.labels.password')}
				<Input let:props class="mt-2">
					<input {...props} type="password" name="password" bind:value={$form.password} {...$constraints.password} />
				</Input>
			</Label>

			<ValidationErrors errors={$errors.password} />
		</div>

		<input name="token" type="hidden" value={$page.url.searchParams.get('resetToken')} />

		<Button type="submit" class="mt-2">{$t('common.submit')}</Button>
	</form>
</div>
