<script lang="ts">
	import { getI18n } from '$i18n';
	import ValidationErrors from '$lib/components/ValidationErrors.svelte';
	import { Button, Helper, Input, Label } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	const i18n = getI18n();
	$: ({ t } = $i18n);

	export let data;

	const { enhance, form, constraints, errors } = superForm(data.form);
</script>

<form method="post" use:enhance class="flex flex-col gap-5 w-3/4 lg:w-1/2 m-auto">
	<div>
		<Label for="email">
			{$t('(auth).login.labels.email')}
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
	<div>
		<Label for="password">
			{$t('(auth).login.labels.password')}
			<Input let:props class="mt-2">
				<input {...props} type="password" name="password" bind:value={$form.password} {...$constraints.password} />
			</Input>
		</Label>

		<ValidationErrors errors={$errors.password} />

		<Helper class="mt-3">
			<a href="/forgot_password" class="hover:underline">{$t('(auth).login.forgot.password.text')}</a>
		</Helper>
	</div>

	<Button type="submit" class="mt-2">{$t('common.submit')}</Button>
</form>
