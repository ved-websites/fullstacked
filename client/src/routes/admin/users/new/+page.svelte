<script lang="ts">
	import { locales } from '$/i18n/translations';
	import UserForm from '$/lib/components/UserForm/UserForm.svelte';
	import VSelect from '$/lib/components/flowbite-custom/VSelect/VSelect.svelte';
	import type { VSelectOptionType } from '$/lib/components/flowbite-custom/VSelect/types';
	import { getI18n } from '$/lib/utils/lang';
	import { Heading, Helper, Input, Label, MultiSelect } from 'flowbite-svelte';
	import type { SelectOptionType } from 'flowbite-svelte/dist/types';
	import { superForm } from 'sveltekit-superforms/client';
	const { t, locale } = getI18n();

	export let data;
	$: ({ roles } = data);

	const superFormData = superForm(data.form);
	const { form, constraints, errors } = superFormData;

	$: $form.emailLang = $locale;

	$: availableRoles = roles.map<SelectOptionType>((role) => ({
		name: role.text,
		value: role.text,
	}));

	$: selectableLocales = locales.map<VSelectOptionType>((l) => ({
		name: $t(`common.lang.map.${l}`),
		value: l as string,
		selected: $locale === l,
	}));
</script>

<Heading tag="h2">Creating New User</Heading>

<UserForm {superFormData}>
	<svelte:fragment slot="above">
		<div>
			<Label>
				<span>{$t('admin.users.new.labels.email')}</span>
				<Input name="email" class="mt-2" type="email" placeholder="example@example.com" bind:value={$form.email} {...$constraints.email} />
				{#if $errors.email}<Helper class="mt-2" color="red">{$errors.email}</Helper>{/if}
			</Label>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="below">
		<div>
			<Label>{$t('admin.users.new.labels.roles')}</Label>
			<MultiSelect name="roles" class="mt-2" items={availableRoles} bind:value={$form.roles} />
			{#if $errors.roles}<Helper class="mt-2" color="red">{$errors.roles}</Helper>{/if}
		</div>
		<div>
			<Label>
				<span>{$t('admin.users.new.labels.email-lang')}</span>
				<VSelect
					name="emailLang"
					placeholder=""
					class="mt-2"
					items={selectableLocales}
					bind:value={$form.emailLang}
					{...$constraints.emailLang}
				/>
				{#if $errors.emailLang}<Helper class="mt-2" color="red">{$errors.emailLang}</Helper>{/if}
			</Label>
		</div>
	</svelte:fragment>
</UserForm>
