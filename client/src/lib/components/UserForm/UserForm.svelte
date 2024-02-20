<script lang="ts" generics="T extends UserFormSchemaType">
	import { getI18n } from '$i18n';
	import { Button, Input, Label } from 'flowbite-svelte';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import ValidationErrors from '../ValidationErrors.svelte';
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
			<Label>
				<span>{$t('shared.userform.labels.firstname')}</span>
				<Input name="firstName" class="mt-2" type="text" bind:value={$form.firstName} {...$constraints.firstName} />
				<ValidationErrors errors={$errors.firstName} />
			</Label>
			<Label>
				<span>{$t('shared.userform.labels.lastname')}</span>
				<Input name="lastName" class="mt-2" type="text" bind:value={$form.lastName} {...$constraints.lastName} />
				<ValidationErrors errors={$errors.lastName} />
			</Label>
		</div>

		<slot name="below" />

		<Button type="submit" class="mt-3">{$t('common.submit')}</Button>
	</div>
</form>
