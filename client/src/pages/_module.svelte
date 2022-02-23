<script lang="ts">
	import Drawer from '$/components/drawer/Drawer.svelte';
	import { themeStore } from '$/stores';
	import TopNavBar from '$/components/topnav/TopNavBar.svelte';
	import { node } from '@roxi/routify';
	import { appTitle, capitalize } from '$/utils';

	// $: contextTitle = $node.meta.title;
	$: metaTitle = 'Hai';

	$: title = capitalize(`${metaTitle ? metaTitle : ''}${metaTitle && appTitle ? ' - ' : ''}${appTitle}`);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="title" content={title} />

	{#if $themeStore}
		<link rel="stylesheet" href={`/theme/smui${$themeStore == 'light' ? '' : '-dark'}.css`} media="screen" />
	{/if}
</svelte:head>

<Drawer>
	<TopNavBar />

	<main class="container">
		<slot />
	</main>
</Drawer>

<style>
	main {
		overflow: auto;
	}
</style>
