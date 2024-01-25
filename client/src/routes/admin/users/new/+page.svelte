<script lang="ts">
	import { getI18n } from '$i18n';
	import UserForm from '$lib/components/UserForm/UserForm.svelte';
	import ValidationErrors from '$lib/components/ValidationErrors.svelte';
	import VSelect from '$lib/components/flowbite-custom/VSelect/VSelect.svelte';
	import type { VSelectOptionType } from '$lib/components/flowbite-custom/VSelect/types';
	import { Heading, Input, Label, MultiSelect, type SelectOptionType } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	let i18n = getI18n();
	$: ({ t, locale, locales } = $i18n);

	export let data;
	$: ({ roles } = data);

	const superFormData = superForm(data.form);
	const { form, constraints, errors } = superFormData;

	$: $form.emailLang = $locale;

	$: availableRoles = roles.map<SelectOptionType<string>>((role) => ({
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
		<div>
			<Label>
				<span>{$t('shared.userform.labels.email')}</span>
				<Input
					name="email"
					class="mt-2"
					type="email"
					placeholder={$t('shared.userform.placeholders.email')}
					bind:value={$form.email}
					{...$constraints.email}
				/>
			</Label>
			<ValidationErrors errors={$errors.email} />
		</div>
	</svelte:fragment>
	<svelte:fragment slot="below">
		<div>
			<Label>{$t('shared.userform.labels.roles')}</Label>
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
