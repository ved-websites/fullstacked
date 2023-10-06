<script lang="ts">
	import { t } from '$i18n';
	import { Alert } from 'flowbite-svelte';

	const sections: { text: string; color: string }[] = [
		{ text: 'teal', color: 'bg-teal-400' },
		{ text: 'red', color: 'bg-red-400' },
		{ text: 'yellow', color: 'bg-yellow-400' },
		{ text: 'blue', color: 'bg-blue-400' },
		{ text: 'gray', color: 'bg-gray-400' },
	];
</script>

<h1 class="text-3xl">Welcome to SvelteKit</h1>
<p class="dark:text-white">{@html $t('home.visit', { link: '<a href="https://kit.svelte.dev">kit.svelte.dev</a>' })}</p>

<div class="self-center flex gap-3">
	{#each sections as section}
		<a href="#{section.text}" class="link">{section.text}</a>
	{/each}
</div>

<div class="px-2">
	<Alert color="blue">
		<span class="font-medium">Info alert!</span> Change a few things up and try submitting again.
	</Alert>
</div>

<div class="my-sections">
	{#each sections as section}
		<section id={section.text} class="{section.color} h-96" />
	{/each}
</div>
