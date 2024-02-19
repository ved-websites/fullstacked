<script lang="ts" context="module">
	export const meta: SettingsRouteMeta = {
		icon: 'i-mdi-face-man-shimmer',
		order: 2,
	};
</script>

<script lang="ts">
	import { getI18n } from '$i18n';
	import ValidationErrors from '$lib/components/ValidationErrors.svelte';
	import VSelect from '$lib/components/flowbite-custom/VSelect/VSelect.svelte';
	import type { VSelectOptionType } from '$lib/components/flowbite-custom/VSelect/types';
	import { Button, Label } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms/client';
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

		const formElement = selectElement.form;

		formElement?.requestSubmit();
	}
</script>

<form method="POST" use:enhance class="w-auto lg:w-[50%] flex flex-col">
	<Label>
		<span>{$t('settings.experience.lang.label')}</span>
		<VSelect
			on:change={handleAutoSubmit}
			name="lang"
			placeholder=""
			class="mt-2"
			items={selectableLocales}
			bind:value={$form.lang}
			{...$constraints.lang}
		/>
		<ValidationErrors errors={$errors.lang} />
	</Label>

	<Button type="submit" class="mt-3 {data.userHasJs ? 'hidden' : ''}">{$t('common.submit')}</Button>
</form>
