<script lang="ts">
	import { getI18n } from '$i18n';
	import UserForm from '$lib/components/UserForm/UserForm.svelte';
	import VSelect from '$lib/components/flowbite-custom/VSelect/VSelect.svelte';
	import type { VSelectOptionType } from '$lib/components/flowbite-custom/VSelect/types';
	import FormInput from '$lib/components/forms/FormInput.svelte';
	import { Heading, MultiSelect, type SelectOptionType } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	let i18n = getI18n();
	$: ({ t, locale, locales } = $i18n);

	export let data;

	const superFormData = superForm(data.form);
	const { form, constraints, errors } = superFormData;

	$: $form.emailLang = $locale;

	$: availableRoles = data.roles.map<SelectOptionType<string>>((role) => ({
		name: $t(`shared.userform.roles.${role.text}`),
		value: role.text,
	}));

	$: selectableLocales = $locales.map<VSelectOptionType>((l) => ({
		name: $t(`common.lang.map.${l}`),
		value: l as string,
		selected: $locale === l,
	}));
</script>

<Heading tag="h2">{$t('admin.users.new.heading')}</Heading>

<UserForm {superFormData}>
	<svelte:fragment slot="above">
		<FormInput
			type="email"
			name="email"
			placeholder={$t('shared.userform.placeholders.email')}
			bind:value={$form.email}
			{...$constraints.email}
			errors={$errors.email}
		>
			{$t('shared.userform.labels.email')}
		</FormInput>
	</svelte:fragment>
	<svelte:fragment slot="below">
		<FormInput bind:value={$form.roles} errors={$errors.roles}>
			{$t('shared.userform.labels.roles')}
			<MultiSelect slot="input" let:value name="roles" class="mt-2" items={availableRoles} {value} />
		</FormInput>

		<FormInput value={$form.emailLang} errors={$errors.emailLang}>
			{$t('admin.users.new.labels.email-lang')}
			<VSelect
				slot="input"
				name="emailLang"
				placeholder=""
				class="mt-2"
				items={selectableLocales}
				bind:value={$form.emailLang}
				{...$constraints.emailLang}
			/>
		</FormInput>
	</svelte:fragment>
</UserForm>
