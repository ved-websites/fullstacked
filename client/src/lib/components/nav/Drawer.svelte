<script lang="ts">
	import type { ClientUser } from '$/lib/utils/hooks-helper.server';
	import { navElements } from '$/navigation';
	import { page } from '$app/stores';
	import { isDrawerHidden } from '$lib/stores';
	import { mdiChevronDown, mdiChevronUp, mdiInformation } from '@mdi/js';
	import { CloseButton, Drawer, Sidebar, SidebarDropdownWrapper, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
	import { sineIn } from 'svelte/easing';
	import DarkMode from '../DarkMode.svelte';
	import Icon from '../Icon.svelte';
	import { isNavElemVisible } from './utils';

	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn,
	};

	export let user: ClientUser;
</script>

<Drawer transitionType="fly" {transitionParams} bind:hidden={$isDrawerHidden} id="main-drawer">
	<div class="flex items-center">
		<h5 id="drawer-label" class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">
			<Icon path={mdiInformation} class="mr-3" />
			Navigation
		</h5>
		<CloseButton on:click={isDrawerHidden.toggle} class="mb-4" />
	</div>
	<Sidebar>
		<SidebarWrapper>
			<SidebarGroup>
				{#each navElements.filter((navElement) => isNavElemVisible(navElement, user)) as navElement}
					{#if 'url' in navElement}
						<SidebarItem
							label={navElement.title}
							active={$page.url.pathname == navElement.url}
							href={navElement.url}
							on:click={() => isDrawerHidden.set(true)}
						>
							<svelte:fragment slot="icon">
								{#if navElement.drawerIconPath}
									<Icon path={navElement.drawerIconPath} />
								{/if}
							</svelte:fragment>
						</SidebarItem>
					{:else}
						<SidebarDropdownWrapper
							label={navElement.title}
							isOpen={navElement.elements.some((navSubElement) => $page.url.pathname == navSubElement.url)}
						>
							<svelte:fragment slot="icon">
								{#if navElement.drawerIconPath}
									<Icon path={navElement.drawerIconPath} />
								{/if}
							</svelte:fragment>
							<svelte:fragment slot="arrowup">
								<Icon path={mdiChevronUp} />
							</svelte:fragment>
							<svelte:fragment slot="arrowdown">
								<Icon path={mdiChevronDown} />
							</svelte:fragment>
							{#each navElement.elements.filter((navSubElement) => navSubElement.isPublic || user) as navSubElement}
								<SidebarItem
									label={navSubElement.title}
									active={$page.url.pathname == navSubElement.url}
									href={navSubElement.url}
									class="pl-8"
									on:click={() => isDrawerHidden.set(true)}
								>
									<svelte:fragment slot="icon">
										{#if navSubElement.drawerIconPath}
											<Icon path={navSubElement.drawerIconPath} />
										{/if}
									</svelte:fragment>
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
