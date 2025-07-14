<script lang="ts" module>
	export const meta: SettingsRouteMeta = {
		icon: 'i-mdi-face-man-shimmer',
		order: 2,
	};
</script>

<script lang="ts">
	import type { VSelectOptionType } from '$lib/components/flowbite-custom/VSelect/types';
	import VSelect from '$lib/components/flowbite-custom/VSelect/VSelect.svelte';
	import FormInput from '$lib/components/forms/FormInput.svelte';
	import { context } from '$lib/runes';
	import { Button } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms';
	import type { SettingsRouteMeta } from '../types.js';

	let {
		i18n: { t, setLocale, locales },
	} = context();

	let { data } = $props();

	const { form, errors, constraints, enhance } = superForm(data.form, {
		onUpdate() {
			setLocale($form.lang ?? data.browserLang);
		},
	});

	let allowedLocales = $derived([null, ...$locales]);

	let selectableLocales = $derived(
		allowedLocales.map<VSelectOptionType>((l) => ({
			name: $t(`settings.experience.lang.map.${l}` satisfies I18nKey),
			value: l as string,
			selected: $form.lang === l,
		})),
	);

	function handleAutoSubmit(e: Event) {
		const selectElement = e.target as HTMLSelectElement;

		const formElement = selectElement.form!;

		formElement.requestSubmit();
	}
</script>

<form method="POST" use:enhance class="w-auto lg:w-[50%] flex flex-col gap-3">
	<FormInput bind:value={$form.lang} errors={$errors.lang}>
		{$t('settings.experience.lang.label')}
		{#snippet input()}
			<VSelect
				class="mt-2"
				onchange={handleAutoSubmit}
				name="lang"
				placeholder=""
				items={selectableLocales}
				bind:value={$form.lang}
				{...$constraints.lang}
			/>
		{/snippet}
	</FormInput>

	<Button type="submit" class={data.userHasJs ? 'hidden' : undefined}>{$t('common.submit')}</Button>
</form>
