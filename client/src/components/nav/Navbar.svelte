<script lang="ts">
	import { isDrawerOpen, isMobile, themeStore } from '$/stores';
	import { appTitle } from '$/utils';
	import { mdiDotsVertical, mdiHome, mdiMenu, mdiThemeLightDark } from '@mdi/js';
	import { isActive, layout, url } from '@roxi/routify';
	import AppBar from 'svelte-materialify/src/components/AppBar/AppBar.svelte';
	import Button from 'svelte-materialify/src/components/Button/Button.svelte';
	import Icon from 'svelte-materialify/src/components/Icon/Icon.svelte';
	import List from 'svelte-materialify/src/components/List/List.svelte';
	import ListItem from 'svelte-materialify/src/components/List/ListItem.svelte';
	import Menu from 'svelte-materialify/src/components/Menu/Menu.svelte';

	$: formattedNodes = $layout.children.map(({ path, title }) => ({ path, title, isActive: $isActive(path) }));
</script>

<AppBar fixed class="w-screen sm:pr-3">
	<div slot="icon">
		{#if $isMobile}
			<Button fab depressed on:click={isDrawerOpen.toggle}>
				<Icon path={mdiMenu} />
			</Button>
		{/if}
	</div>
	<div slot="title">
		<span>{appTitle}</span>
	</div>
	<div style="flex-grow: 1" />
	<img src={$url('/icons/pwa/icon-512x512.png')} alt="Logo" class="object-contain h-10" />
	<div style="flex-grow: 1" />
	<div id="right-menu">
		<a href={$url('/')}>
			<Button>
				<span> Home </span>
				<Icon path={mdiHome} class="ml-3" />
			</Button>
		</a>
		<Menu right>
			<div slot="activator">
				<Button>
					<span> Navigation </span>
					<Icon path={mdiDotsVertical} class="ml-3" />
				</Button>
			</div>
			<List>
				{#each formattedNodes as { path, title, isActive }}
					{#if isActive}
						<ListItem active={isActive}>
							{title}
						</ListItem>
					{:else}
						<a href={$url(path)}>
							<ListItem active={isActive}>
								{title}
							</ListItem>
						</a>
					{/if}
				{/each}
			</List>
		</Menu>
		<Button fab depressed on:click={themeStore.toggle}>
			<Icon path={mdiThemeLightDark} />
		</Button>
	</div>
</AppBar>

<style>
	:global(.s-app-bar) {
		@apply flex-initial;
	}

	:global(.s-app-bar__wrapper) {
		@apply justify-center;
	}

	#right-menu > :global(*:not(:last-child)) {
		@apply mr-2;
	}
</style>
