<script lang="ts">
	import { getI18n } from '$i18n';
	import UserForm from '$lib/components/UserForm/UserForm.svelte';
	import ValidationErrors from '$lib/components/forms/ValidationErrors.svelte';
	import { Heading, Label, MultiSelect, type SelectOptionType } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms';
	let i18n = getI18n();
	$: ({ t } = $i18n);

	export let data;

	const superFormData = superForm(data.form);
	const { form, errors } = superFormData;

	$: availableRoles = data.roles.map<SelectOptionType<string>>((role) => ({
		name: $t(`shared.userform.roles.${role.text}`),
		value: role.text,
	}));
</script>

<Heading tag="h2" class="overflow-x-clip text-ellipsis">{$t('admin.users.[email].heading', { email: data.editableUser?.email })}</Heading>

<UserForm {superFormData} class="col-span-2 order-1 sm:order-none">
	<div slot="below">
		<Label>{$t('shared.userform.labels.roles')}</Label>
		<MultiSelect name="roles" class="mt-2" items={availableRoles} bind:value={$form.roles} />
		<ValidationErrors errors={$errors.roles} />
	</div>
</UserForm>
