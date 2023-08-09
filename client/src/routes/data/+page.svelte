<script lang="ts">
	import { P } from 'flowbite-svelte';
	import type { PageData } from './$houdini';

	export let data: PageData;

	$: ({ InitialMessages } = data);
</script>

{#if $InitialMessages.fetching}
	<P>Fetching...</P>
{:else if $InitialMessages.errors || !$InitialMessages.data}
	<P color="red">Error!</P>
	<P color="red">{$InitialMessages.errors?.length == 1 ? $InitialMessages.errors[0]?.message : 'Multiple errors! Oh no!'}</P>
{:else}
	{#each $InitialMessages.data.messages as message}
		<P>{message.user.email} : {message.text}</P>
	{/each}
{/if}
