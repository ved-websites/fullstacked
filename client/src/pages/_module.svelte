<script lang="ts">
	import Drawer from '$/components/drawer/Drawer.svelte';
	import TopNavBar from '$/components/topnav/TopNavBar.svelte';
	import { themeStore } from '$/stores';
	// import { node } from '@roxi/routify';
	import { appTitle, capitalize } from '$/utils';
	import { browser } from '$app/env';
	import { derived } from 'svelte/store';
	import 'virtual:windi.css';

	// $: contextTitle = $node.meta.title;
	$: metaTitle = 'Hai';

	$: title = capitalize(`${metaTitle ? metaTitle : ''}${metaTitle && appTitle ? ' - ' : ''}${appTitle}`);

	let windiTheme = derived(themeStore, (theme) => {
		if (!theme && browser) {
			return window.matchMedia('(prefers-color-scheme: dark)').matches;
		}

		return theme == 'dark';
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="title" content={title} />

	{#if $themeStore}
		<link rel="stylesheet" href={`/theme/smui${$themeStore == 'light' ? '' : '-dark'}.css`} media="screen" />
	{/if}
</svelte:head>

<div class:dark={$windiTheme}>
	<Drawer>
		<TopNavBar />

		<main class="container py-3">
			<slot />
		</main>
	</Drawer>
</div>

<style>
	main {
		overflow: auto;
	}
</style>
