<script lang="ts" generics="T extends UserFormSchemaType">
	import { getI18n } from '$i18n';
	import { Button, Helper, Input, Label } from 'flowbite-svelte';
	import type { SuperForm } from 'sveltekit-superforms/client';
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	import type { UserFormSchemaType } from './userform.schema';
	const { t } = getI18n();

	// eslint-disable-next-line no-undef
	export let superFormData: SuperForm<T>;

	$: ({ enhance, form, constraints, errors } = superFormData);
</script>

<form method="post" use:enhance {...$$restProps}>
	<div class="grid gap-3">
		<slot name="above" />

		<div class="grid gap-3 sm:grid-cols-2">
			<Label>
				<span> First Name </span>
				<Input name="firstName" class="mt-2" type="text" bind:value={$form.firstName} {...$constraints.firstName} />
				{#if $errors.firstName}<Helper class="mt-2" color="red">{$errors.firstName}</Helper>{/if}
			</Label>
			<Label>
				<span> Last Name </span>
				<Input name="lastName" class="mt-2" type="text" bind:value={$form.lastName} {...$constraints.lastName} />
				{#if $errors.lastName}<Helper class="mt-2" color="red">{$errors.lastName}</Helper>{/if}
			</Label>
		</div>

		<slot name="below" />

		<Button type="submit" class="mt-3">{$t('common.submit')}</Button>
	</div>
</form>
