<script lang="ts" generics="T extends UserFormSchemaType = UserFormSchemaType">
	import { contextPublic } from '$lib/runes';
	import { Button } from 'flowbite-svelte';
	import type { SuperForm } from 'sveltekit-superforms';
	import FormInput from '../forms/FormInput.svelte';
	import type { UserFormSchemaType } from './userform.schema';

	let {
		i18n: { t },
	} = contextPublic();

	interface Props extends SProps<{ above?: void; below?: void }> {
		superFormData: SuperForm<T, any>;
	}

	let { superFormData, above, below, ...rest }: Props = $props();

	let { enhance, form, constraints, errors } = $derived(superFormData as SuperForm<UserFormSchemaType, any>);
</script>

<form method="POST" use:enhance {...rest}>
	<div class="grid gap-3">
		{@render above?.()}

		<div class="grid gap-3 sm:grid-cols-2">
			<FormInput type="text" name="firstName" bind:value={$form.firstName} {...$constraints.firstName} errors={$errors.firstName}>
				{$t('shared.userform.labels.firstname')}
			</FormInput>

			<FormInput type="text" name="lastName" bind:value={$form.lastName} {...$constraints.lastName} errors={$errors.firstName}>
				{$t('shared.userform.labels.lastname')}
			</FormInput>
		</div>

		{@render below?.()}

		<Button type="submit" class="mt-3">{$t('common.submit')}</Button>
	</div>
</form>
