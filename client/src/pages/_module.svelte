<script lang="ts">
	import Drawer from '$/components/drawer/Drawer.svelte';
	import TopNavBar from '$/components/topnav/TopNavBar.svelte';
	import { themeStore } from '$/stores';
	import '$/styles/default.scss';
	import { pageTitle } from '$/utils';
	import { browser } from '$app/env';
	import { node } from '@roxi/routify';
	import { derived } from 'svelte/store';
	import 'virtual:windi.css';

	let windiTheme = derived(themeStore, (theme) => {
		if (!theme && browser) {
			return window.matchMedia('(prefers-color-scheme: dark)').matches;
		}

		return theme == 'dark';
	});
</script>

<svelte:head>
	<title>{$pageTitle}</title>

	{#if $themeStore}
		<link rel="stylesheet" href={`/theme/smui${$themeStore == 'light' ? '' : '-dark'}.css`} media="screen" />
	{/if}
</svelte:head>

<div class:dark={$windiTheme}>
	<Drawer moduleNode={$node}>
		<TopNavBar />

		<main class="w-auto container py-3">
			<slot />
		</main>
	</Drawer>
</div>

<style>
	main {
		overflow: auto;
	}
</style>
