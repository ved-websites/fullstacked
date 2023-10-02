<script lang="ts" context="module">
	export const name = 'Experience';
	export const icon = 'i-mdi-face-man-shimmer';
	export const order = 10;
</script>

<script lang="ts">
	import VSelect from '$/lib/components/flowbite-custom/VSelect/VSelect.svelte';
	import type { VSelectOptionType } from '$/lib/components/flowbite-custom/VSelect/types';

	import { locales, t } from '$i18n';
	import { Button, Helper, Label } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms/client';

	export let data;

	const { form, errors, constraints, enhance } = superForm(data.form);

	$: allowedLocales = [null, ...$locales];

	$: selectableLocales = allowedLocales.map<VSelectOptionType>((l) => ({
		name: $t(`settings.experience.lang.map.${l}`),
		value: l as string,
		selected: $form.lang === l,
	}));
</script>

<form method="POST" use:enhance class="grid gap-3 grid-cols-1 sm:grid-cols-2">
	<Label>
		<span> Language </span>
		<VSelect name="lang" placeholder="" class="mt-2" items={selectableLocales} bind:value={$form.lang} {...$constraints.lang} />
		{#if $errors.lang}<Helper class="mt-2" color="red">{$errors.lang}</Helper>{/if}
	</Label>

	<Button type="submit" class="mt-3 col-span-1 sm:col-span-2">{$t('common.submit')}</Button>
</form>
