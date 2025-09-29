<script lang="ts">
	import UserForm from '$lib/components/UserForm/UserForm.svelte';
	import VSelect from '$lib/components/flowbite-custom/VSelect/VSelect.svelte';
	import type { VSelectOptionType } from '$lib/components/flowbite-custom/VSelect/types';
	import FormInput from '$lib/components/forms/FormInput.svelte';
	import { context } from '$lib/runes';
	import { Heading, MultiSelect, type SelectOptionType } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms';

	let {
		i18n: { t, locale, locales },
	} = $derived(context());

	let { data } = $props();

	const superFormData = superForm(data.form);
	const { form, constraints, errors } = superFormData;

	$effect(() => {
		$form.emailLang = $locale;
	});

	let availableRoles = $derived(
		data.roles.map<SelectOptionType<string>>((role) => ({
			name: $t(`shared.userform.roles.${role.text}`),
			value: role.text,
		})),
	);

	let selectableLocales = $derived(
		$locales.map<VSelectOptionType>((l) => ({
			name: $t(`common.lang.map.${l}`),
			value: l as string,
			selected: $locale === l,
		})),
	);
</script>

<Heading tag="h2">{$t('admin.users.new.heading')}</Heading>

<UserForm {superFormData}>
	{#snippet above()}
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
	{/snippet}
	{#snippet below()}
		<FormInput bind:value={$form.roles} errors={$errors.roles}>
			{$t('shared.userform.labels.roles')}
			{#snippet input({ value })}
				<MultiSelect name="roles" class="mt-2" items={availableRoles} {value} />
			{/snippet}
		</FormInput>

		<FormInput value={$form.emailLang} errors={$errors.emailLang}>
			{$t('admin.users.new.labels.email-lang')}
			{#snippet input()}
				<VSelect
					name="emailLang"
					placeholder=""
					class="mt-2"
					items={selectableLocales}
					bind:value={$form.emailLang}
					{...$constraints.emailLang}
				/>
			{/snippet}
		</FormInput>
	{/snippet}
</UserForm>
