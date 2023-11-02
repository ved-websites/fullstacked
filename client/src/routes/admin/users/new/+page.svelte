<script lang="ts">
	import { getI18n } from '$i18n';
	import { locales } from '$i18n-config';
	import UserForm from '$lib/components/UserForm/UserForm.svelte';
	import ValidationErrors from '$lib/components/ValidationErrors.svelte';
	import VSelect from '$lib/components/flowbite-custom/VSelect/VSelect.svelte';
	import type { VSelectOptionType } from '$lib/components/flowbite-custom/VSelect/types';
	import { Heading, Input, Label, MultiSelect } from 'flowbite-svelte';
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
			</Label>
			<ValidationErrors errors={$errors.email} />
		</div>
	</svelte:fragment>
	<svelte:fragment slot="below">
		<div>
			<Label>{$t('admin.users.new.labels.roles')}</Label>
			<MultiSelect name="roles" class="mt-2" items={availableRoles} bind:value={$form.roles} />
			<ValidationErrors errors={$errors.roles} />
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
			</Label>
			<ValidationErrors errors={$errors.emailLang} />
		</div>
	</svelte:fragment>
</UserForm>
