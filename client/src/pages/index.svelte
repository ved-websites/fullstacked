<!-- routify:options title="Home" -->
<script lang="ts">
	import Loader from '$/components/Loader.svelte';
	import TailSpin from '$/components/spinners/TailSpin.svelte';
	import ThreeDots from '$/components/spinners/ThreeDots.svelte';
	import { url } from '@roxi/routify';
	import TextField from 'svelte-materialify/src/components/TextField/TextField.svelte';
	import Counter from './_components/Counter.svelte';
	import Item from './_components/Item.svelte';
	import Logo from './_components/Logo.svelte';

	export let name: string = 'Banana';

	const items = [
		{ name: 'Item 1', done: false, count: 0 },
		{ name: 'Item 2', done: false, count: 0 },
		{ name: 'Item 3', done: false, count: 0 },
	];
</script>

<div class="self-center pb-5">
	<a href={$url('#teal')} class="hover:underline">teal</a>
	<a href={$url('#red')} class="hover:underline">red</a>
	<a href={$url('#yellow')} class="hover:underline">yellow</a>
	<a href={$url('#blue')} class="hover:underline">blue</a>
	<a href={$url('#gray')} class="hover:underline">gray</a>
</div>

<p class="mb-5 self-center">Hello {name}!</p>

<form class="mb-5 self-center">
	<TextField bind:value={name}>Random Name</TextField>
</form>

<div class="mb-5 flex justify-center">
	<Logo />
</div>

<div class="mb-5 self-center">
	<Counter name="3" />
</div>

<div class="mb-5 self-center">
	<button class="flex button-blue py-2 px-4 rounded-md">
		<span>This is my button</span>
		<Loader doHide class="ml-2" promise={new Promise((resolve, reject) => setTimeout(resolve, 10000))}>
			<TailSpin />
		</Loader>
	</button>
</div>

<div class="mb-5 self-center h-4">
	<ThreeDots />
</div>

<div class="self-center">
	{#each items as item, index (item)}
		{#if index == 0 || items[index - 1].done}
			<Item name={item.name} bind:count={item.count} bind:isDone={item.done} />
		{/if}
	{/each}
</div>

<div class="mb-5 self-center flex flex-col">
	{#each items as { count }, index}
		<span>Count {index + 1} : {count}</span>
	{/each}
</div>

<div class="App">
	<section id="teal" class="bg-teal-400 h-96" />
	<section id="red" class="bg-red-400 h-96" />
	<section id="yellow" class="bg-yellow-400 h-96" />
	<section id="blue" class="bg-blue-400 h-96" />
	<section id="gray" class="bg-gray-400 h-96" />
</div>
