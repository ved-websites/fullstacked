<script lang="ts">
	import { isDrawerOpen, themes, themeStore } from '$/stores';
	import { capitalize } from '$/utils';
	import type { RNodeRuntime } from '@roxi/routify/typings/lib/runtime/Instance/RNodeRuntime';
	import Drawer, { AppContent, Content, Header, Scrim, Subtitle, Title } from '@smui/drawer';
	import List from '@smui/list';
	import Select, { Option } from '@smui/select';
	import PageList from './PageList.svelte';

	export let moduleNode: RNodeRuntime;

	const homePath = '/';

	const systemChoice = 'system default';
	const themesSelection = [systemChoice, ...themes];

	$: themeChoice = ($themeStore ?? systemChoice) as typeof themes[number] | typeof systemChoice;

	function onThemeSelect(e: CustomEvent<{ value: typeof themeChoice; index: number }>) {
		const selectedTheme = e.detail.value;

		themeStore.set(selectedTheme != systemChoice ? selectedTheme : null);
	}
</script>

<Drawer variant="modal" bind:open={$isDrawerOpen}>
	<Header class="pb-3">
		<Title>Super Mail</Title>
		<Subtitle>It's the best fake mail app drawer.</Subtitle>
	</Header>
	<Content>
		<div id="navigation">
			<PageList initialNodes={[{ isDir: false, icon: 'home', path: homePath, title: 'Home' }]} pageNodes={moduleNode.pages} />
		</div>
		<List>
			<Select bind:value={themeChoice} label="Theme" class="mdc-list-item" on:SMUISelect:change={onThemeSelect}>
				{#each themesSelection as theme}
					<Option value={theme}>{capitalize(theme)}</Option>
				{/each}
			</Select>
		</List>
	</Content>
</Drawer>

<Scrim />

<AppContent>
	<slot />
</AppContent>

<style>
	div#navigation :global(.smui-accordion .smui-accordion__panel.smui-accordion__panel--open) {
		@apply my-0;
	}
</style>
