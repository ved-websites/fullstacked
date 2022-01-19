<script lang="ts">
	export let username: string;
	export let text: string;
	export let active = false;

	export let time: string | undefined;

	$: convertedTime = (time && new Date(time)) || undefined;

	// $: formattedDate = convertedTime?.toLocaleDateString();
	$: formattedTime = convertedTime?.toLocaleTimeString();
</script>

<li class:inactive={!active}>
	{#if formattedTime}
		<span class="italic">{formattedTime}</span>
		<span> - </span>
	{/if}
	<span class="font-weight-bold">{username}</span>
	<span> : </span>
	<span>
		{text}
	</span>
</li>

<style>
	li.inactive {
		@apply text-gray-400 italic;
	}
</style>
