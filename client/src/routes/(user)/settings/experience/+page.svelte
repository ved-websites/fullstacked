<script lang="ts" context="module">
	export const meta: SettingsRouteMeta = {
		icon: 'i-mdi-face-man-shimmer',
		order: 2,
	};
</script>

<script lang="ts">
	import { getI18n } from '$i18n';
	import VSelect from '$lib/components/flowbite-custom/VSelect/VSelect.svelte';
	import type { VSelectOptionType } from '$lib/components/flowbite-custom/VSelect/types';
	import FormInput from '$lib/components/forms/FormInput.svelte';
	import { Button } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms';
	import type { SettingsRouteMeta } from '../types.js';
	let i18n = getI18n();
	$: ({ t, setLocale, locales } = $i18n);

	export let data;

	const { form, errors, constraints, enhance } = superForm(data.form, {
		onUpdate() {
			setLocale($form.lang ?? data.browserLang);
		},
	});

	$: allowedLocales = [null, ...$locales];

	$: selectableLocales = allowedLocales.map<VSelectOptionType>((l) => ({
		name: $t(`settings.experience.lang.map.${l}`),
		value: l as string,
		selected: $form.lang === l,
	}));

	function handleAutoSubmit(e: Event) {
		const selectElement = e.target as HTMLSelectElement;

		const formElement = selectElement.form!;

		formElement.requestSubmit();
	}
</script>

<form method="POST" use:enhance class="w-auto lg:w-[50%] flex flex-col gap-3">
	<FormInput bind:value={$form.lang} errors={$errors.lang}>
		{$t('settings.experience.lang.label')}
		<VSelect
			slot="input"
			class="mt-2"
			on:change={handleAutoSubmit}
			name="lang"
			placeholder=""
			items={selectableLocales}
			bind:value={$form.lang}
			{...$constraints.lang}
		/>
	</FormInput>

	<Button type="submit" class={data.userHasJs ? 'hidden' : undefined}>{$t('common.submit')}</Button>
</form>
