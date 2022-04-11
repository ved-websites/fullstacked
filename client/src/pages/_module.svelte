<script lang="ts">
	import Drawer from '$/components/drawer/Drawer.svelte';
	import TopNavBar from '$/components/topnav/TopNavBar.svelte';
	import { themeStore, type Theme } from '$/stores';
	import '$/styles/default.scss';
	import { pageTitle } from '$/utils';
	import { browser } from '$app/env';
	import { node } from '@roxi/routify';
	import { derived } from 'svelte/store';
	import 'virtual:windi.css';

	let isWindiDark = derived(themeStore, (theme) => {
		if (!theme && browser) {
			return window.matchMedia('(prefers-color-scheme: dark)').matches;
		}

		return theme == 'dark';
	});

	const initialTheme = $themeStore;

	const themeStylesheet = browser && (document.getElementById('selectedTheme') as HTMLLinkElement);

	const themeMap: Record<Theme, string> = {
		light: '/theme/smui.css',
		dark: '/theme/smui-dark.css',
	};

	$: {
		if (themeStylesheet) {
			themeStylesheet.disabled = $themeStore == null;
			themeStylesheet.href = $themeStore ? themeMap[$themeStore] : '#';

			themeStylesheet.onload = () => {
				const initialThemeStylesheet = document.getElementById('initialTheme') as HTMLLinkElement | undefined;

				if (initialThemeStylesheet) {
					initialThemeStylesheet.disabled = true;
				}
			};
		}
	}
</script>

<svelte:head>
	<title>{$pageTitle}</title>

	{#if initialTheme}
		<link id="initialTheme" rel="stylesheet" href={`/theme/smui${initialTheme == 'light' ? '' : '-dark'}.css`} media="screen" />
	{/if}
</svelte:head>

<div class:dark={$isWindiDark}>
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
