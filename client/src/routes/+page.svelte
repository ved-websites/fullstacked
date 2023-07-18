<script lang="ts">
	import { Alert } from 'flowbite-svelte';
</script>

<h1 class="text-3xl">Welcome to SvelteKit</h1>
<p class="dark:text-white">
	Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>

<div class="self-center py-5">
	<a href="#teal" class="link">teal</a>
	<a href="#red" class="link">red</a>
	<a href="#yellow" class="link">yellow</a>
	<a href="#blue" class="link">blue</a>
	<a href="#gray" class="link">gray</a>
</div>

<div class="py-8 px-2">
	<Alert color="blue">
		<span class="font-medium">Info alert!</span> Change a few things up and try submitting again.
	</Alert>
</div>

<div class="my-sections">
	<section id="teal" class="bg-teal-400 h-96" />
	<section id="red" class="bg-red-400 h-96" />
	<section id="yellow" class="bg-yellow-400 h-96" />
	<section id="blue" class="bg-blue-400 h-96" />
	<section id="gray" class="bg-gray-400 h-96" />
</div>
