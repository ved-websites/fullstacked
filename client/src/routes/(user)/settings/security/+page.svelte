<script lang="ts" context="module">
	export const icon = 'i-mdi-security';
</script>

<script lang="ts">
	import { getI18n } from '$i18n';
	import ValidationErrors from '$lib/components/ValidationErrors.svelte';
	import { Button, Input, Label } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	const { t } = getI18n();

	export let data;

	const { form, errors, constraints, enhance } = superForm(data.form);
</script>

<form method="POST" use:enhance class="grid gap-3 grid-cols-1 sm:grid-cols-2">
	<Label>
		<span> New Password </span>
		<Input
			name="password"
			class="mt-2"
			type="password"
			bind:value={$form.password}
			color={$errors.password ? 'red' : 'base'}
			{...$constraints.password}
		/>
		<ValidationErrors errors={$errors.password} />
	</Label>
	<Label>
		<span> Confirm New Password </span>
		<Input
			name="confirm"
			class="mt-2"
			type="password"
			bind:value={$form.confirm}
			color={$errors.confirm ? 'red' : 'base'}
			{...$constraints.confirm}
		/>
		<ValidationErrors errors={$errors.confirm} />
	</Label>

	<Button type="submit" class="mt-3 col-span-1 sm:col-span-2">{$t('common.submit')}</Button>
</form>
