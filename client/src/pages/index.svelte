<!-- routify:meta title="Hello!" -->
<script lang="ts">
	import Loader from '$/components/Loader.svelte';
	import TailSpin from '$/components/spinners/TailSpin.svelte';
	import ThreeDots from '$/components/spinners/ThreeDots.svelte';
	import { mdiSend, mdiThumbUp } from '@mdi/js';
	import Button, { Icon, Label } from '@smui/button';
	import { Svg } from '@smui/common/elements';
	import Textfield from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';
	import Counter from './_components/Counter.svelte';
	import Item from './_components/Item.svelte';
	import Logo from './_components/Logo.svelte';

	let focused = false;
	let value: string | null = null;
	let dirty = false;
	let invalid = false;
	$: disabled = focused || !value || !dirty || invalid;

	function clickHandler() {
		alert(`Sending to ${value}!`);
		value = null;
		dirty = false;
	}

	let clicked = 0;

	function handleClick(event: CustomEvent | MouseEvent) {
		event = event as MouseEvent;
		if (event.button === 0) {
			clicked++;
		} else if (event.button === 1) {
			event.preventDefault();
			clicked = 0;
		}
	}

	export let name: string = 'Banana';

	const items = [
		{ name: 'Item 1', done: false, count: 0 },
		{ name: 'Item 2', done: false, count: 0 },
		{ name: 'Item 3', done: false, count: 0 },
	];
</script>

<Textfield
	type="email"
	bind:dirty
	bind:invalid
	updateInvalid
	bind:value
	label="To"
	style="min-width: 250px;"
	input$autocomplete="email"
	on:focus={() => (focused = true)}
	on:blur={() => (focused = false)}
	withTrailingIcon={!disabled}
>
	<!--
      Since this icon is conditional, it needs to be wrapped
      in a fragment, and we need to provide withTrailingIcon.
    -->
	<svelte:fragment slot="trailingIcon">
		{#if !disabled}
			<Icon role="button" component={Svg} viewBox="0 0 24 24" on:click={clickHandler}>
				<path fill="currentColor" d={mdiSend} />
			</Icon>
		{/if}
	</svelte:fragment>
	<HelperText validationMsg slot="helper">That's not a valid email address.</HelperText>
</Textfield>

<Button on:mousedown={handleClick}>
	<Icon component={Svg} viewBox="0 0 24 24">
		<path fill="currentColor" d={mdiThumbUp} />
	</Icon>
	<Label>Click Me</Label>
</Button>

<p class="mdc-typography--body1">
	{#if clicked}
		<span class="text-blue-400">You've clicked the button {clicked} time{clicked === 1 ? '' : 's'}. Middle click the button to reset.</span>
	{:else}
		<span class="opacity-60">You haven't clicked the button.</span>
	{/if}
</p>

<div class="self-center pb-5">
	<a href="#teal" class="hover:underline">teal</a>
	<a href="#red" class="hover:underline">red</a>
	<a href="#yellow" class="hover:underline">yellow</a>
	<a href="#blue" class="hover:underline">blue</a>
	<a href="#gray" class="hover:underline">gray</a>
</div>

<p class="mb-5 self-center">Hello {name}!</p>

<form class="mb-5 self-center">
	<Textfield label="Random Name" bind:value={name} />
</form>

<div class="mb-5 flex justify-center">
	<Logo />
</div>

<div class="mb-5 self-center">
	<Counter name="3" />
</div>

<div class="mb-5 self-center">
	<button class="flex items-center button-blue py-2 px-4 rounded-md">
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

<div class="my-sections">
	<section id="teal" class="bg-teal-400 h-96" />
	<section id="red" class="bg-red-400 h-96" />
	<section id="yellow" class="bg-yellow-400 h-96" />
	<section id="blue" class="bg-blue-400 h-96" />
	<section id="gray" class="bg-gray-400 h-96" />
</div>
