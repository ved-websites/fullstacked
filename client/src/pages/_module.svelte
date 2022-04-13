<script lang="ts">
	import Drawer from '$/components/drawer/Drawer.svelte';
	import ThemeDetectorSSR from '$/components/theme/ThemeDetectorSSR.svelte';
	import TopNavBar from '$/components/topnav/TopNavBar.svelte';
	import { themeStore, useMediaQuery, type Theme } from '$/stores';
	import '$/styles/default.scss';
	import { pageTitle } from '$/utils';
	import { browser } from '$app/env';
	import { node } from '@roxi/routify';
	import { classList } from 'svelte-body';
	import { derived } from 'svelte/store';
	import 'virtual:windi.css';

	const mediaDarkScheme = useMediaQuery('(prefers-color-scheme: dark)');

	let isWindiDark = derived([themeStore, mediaDarkScheme], ([$theme, $mediaDark]) => {
		if (!$theme) {
			return $mediaDark;
		}

		return $theme == 'dark';
	});

	const themeStylesheet = browser && (document.getElementById('selectedTheme') as HTMLLinkElement);

	const themeMap: Record<Theme, string> = {
		light: '/theme/smui.css',
		dark: '/theme/smui-dark.css',
	};

	$: if (themeStylesheet) {
		themeStylesheet.disabled = $themeStore == null;
		themeStylesheet.href = $themeStore ? themeMap[$themeStore] : '#';

		themeStylesheet.onload = () => document.documentElement.removeAttribute('style');
	}
</script>

<svelte:head>
	<title>{$pageTitle}</title>
</svelte:head>

<svelte:body use:classList={{ dark: $isWindiDark }} />

<ThemeDetectorSSR />

<Drawer moduleNode={$node}>
	<TopNavBar />

	<main class="w-auto container py-3">
		<slot />
	</main>
</Drawer>

<style>
	main {
		overflow: auto;
	}
</style>
