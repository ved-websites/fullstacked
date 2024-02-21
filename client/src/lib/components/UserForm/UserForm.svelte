<script lang="ts" generics="T extends UserFormSchemaType">
	import { getI18n } from '$i18n';
	import { Button } from 'flowbite-svelte';
	import type { SuperForm } from 'sveltekit-superforms';
	import FormInput from '../forms/FormInput.svelte';
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	import type { UserFormSchemaType } from './userform.schema';
	let i18n = getI18n();
	$: ({ t } = $i18n);

	// eslint-disable-next-line no-undef
	export let superFormData: SuperForm<T>;

	$: ({ enhance, form, constraints, errors } = superFormData);
</script>

<form method="POST" use:enhance {...$$restProps}>
	<div class="grid gap-3">
		<slot name="above" />

		<div class="grid gap-3 sm:grid-cols-2">
			<FormInput type="text" name="firstName" bind:value={$form.firstName} {...$constraints.firstName} errors={$errors.firstName}>
				{$t('shared.userform.labels.firstname')}
			</FormInput>

			<FormInput type="text" name="lastName" bind:value={$form.lastName} {...$constraints.lastName} errors={$errors.firstName}>
				{$t('shared.userform.labels.firstname')}
			</FormInput>
		</div>

		<slot name="below" />

		<Button type="submit" class="mt-3">{$t('common.submit')}</Button>
	</div>
</form>
