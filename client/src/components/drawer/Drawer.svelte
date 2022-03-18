<script lang="ts">
	import { isDrawerOpen, themes, themeStore } from '$/stores';
	import { capitalize } from '$/utils';
	import { browser } from '$app/env';
	import { goto, isActive } from '@roxi/routify';
	import type { RNodeRuntime } from '@roxi/routify/typings/lib/runtime/Instance/RNodeRuntime';
	import Drawer, { AppContent, Content, Header, Scrim, Subtitle, Title } from '@smui/drawer';
	import List, { Graphic, Item, Text } from '@smui/list';
	import Select, { Option } from '@smui/select';
	import PageList from './PageList.svelte';

	const systemChoice = 'system default';

	const themesSelection = [systemChoice, ...themes];

	export let moduleNode: RNodeRuntime;

	function gotoPath(path: string) {
		isDrawerOpen.set(false);
		$goto(path);
	}

	$: browser && themeChoice && themeStore.set(themeChoice != systemChoice ? (themeChoice as typeof themes[number]) : null);
	$: themeChoice = $themeStore ?? systemChoice;
</script>

<Drawer variant="modal" bind:open={$isDrawerOpen}>
	<Header>
		<Title>Super Mail</Title>
		<Subtitle>It's the best fake mail app drawer.</Subtitle>
	</Header>
	<Content>
		<List>
			<Item on:click={() => gotoPath('/')} activated={$isActive('/')}>
				<Graphic aria-hidden="true" class="material-icons">home</Graphic>
				<Text>Home</Text>
			</Item>
		</List>
		<PageList pageNodes={moduleNode.pages} />
		<List>
			<Select bind:value={themeChoice} label="Theme" class="mdc-list-item">
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
