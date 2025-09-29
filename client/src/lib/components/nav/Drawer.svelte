<script lang="ts">
	import { page } from '$app/state';
	import { contextPublic } from '$lib/runes';
	import { isDrawerOpen } from '$lib/stores';
	import { navElements } from '$navigation/routes';
	import { Drawer, Sidebar, SidebarDropdownWrapper, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
	import { sineIn } from 'svelte/easing';
	import DarkMode from '../DarkMode.svelte';
	import Icon from '../Icon.svelte';
	import { isNavElemVisible } from './utils';

	let {
		i18n: { t },
		sessionUser,
	} = $derived(contextPublic());

	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn,
	};
</script>

<Drawer {transitionParams} bind:open={$isDrawerOpen} id="main-drawer" class="min-w-64 max-w-max">
	<div class="flex items-center mb-4">
		<h5 id="drawer-label" class="inline-flex items-center text-base font-semibold text-gray-500 dark:text-gray-400">
			<Icon class="i-mdi-information mr-3" />
			{$t('navbar.drawer.header')}
		</h5>
	</div>
	<Sidebar activeUrl={page.url.pathname} backdrop={false} disableBreakpoints={true} alwaysOpen={true} position="static">
		<SidebarWrapper>
			<SidebarGroup>
				{#each navElements.filter((navElement) => isNavElemVisible(navElement, sessionUser)) as navElement}
					{#if 'url' in navElement}
						<SidebarItem label={$t(navElement.title)} href={navElement.url} onclick={() => isDrawerOpen.set(true)}>
							{#snippet icon()}
								{#if navElement.drawerIconPath}
									<Icon class={navElement.drawerIconPath} />
								{/if}
							{/snippet}
						</SidebarItem>
					{:else}
						{console.log('navElement:', navElement, 'page.url.pathname:', page.url.pathname)}
						<SidebarDropdownWrapper
							label={$t(navElement.title)}
							isOpen={navElement.elements.some((navSubElement) => page.url.pathname == navSubElement.url)}
						>
							{#snippet icon()}
								{#if navElement.drawerIconPath}
									<Icon class={navElement.drawerIconPath} />
								{/if}
							{/snippet}
							{#snippet arrowup()}
								<Icon class="i-mdi-chevron-up" />
							{/snippet}
							{#snippet arrowdown()}
								<Icon class="i-mdi-chevron-down" />
							{/snippet}
							{#each navElement.elements.filter((navSubElement) => isNavElemVisible(navSubElement, sessionUser)) as navSubElement}
								<SidebarItem label={$t(navSubElement.title)} href={navSubElement.url} onclick={() => isDrawerOpen.set(true)}>
									{#snippet icon()}
										{#if navSubElement.drawerIconPath}
											<Icon class={navSubElement.drawerIconPath} />
										{/if}
									{/snippet}
								</SidebarItem>
							{/each}
						</SidebarDropdownWrapper>
					{/if}
				{/each}
			</SidebarGroup>
		</SidebarWrapper>
	</Sidebar>
	<div class="mt-3 flex justify-center">
		<DarkMode />
	</div>
</Drawer>
