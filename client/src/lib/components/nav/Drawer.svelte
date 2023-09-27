<script lang="ts">
	import type { SessionUser } from '$/auth/auth-handler';
	import { navElements } from '$/navigation/routes';
	import { page } from '$app/stores';
	import { isDrawerHidden } from '$lib/stores';
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

	export let sessionUser: SessionUser;
</script>

<Drawer transitionType="fly" {transitionParams} bind:hidden={$isDrawerHidden} id="main-drawer" class="max-w-max">
	<div class="flex items-center">
		<h5 id="drawer-label" class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">
			<Icon class="i-mdi-information mr-3" />
			Navigation
		</h5>
		<CloseButton on:click={isDrawerHidden.toggle} class="mb-4" />
	</div>
	<Sidebar>
		<SidebarWrapper>
			<SidebarGroup>
				{#each navElements.filter((navElement) => isNavElemVisible(navElement, sessionUser)) as navElement}
					{#if 'url' in navElement}
						<SidebarItem
							label={navElement.title}
							active={$page.url.pathname == navElement.url}
							href={navElement.url}
							on:click={() => isDrawerHidden.set(true)}
						>
							<svelte:fragment slot="icon">
								{#if navElement.drawerIconPath}
									<Icon class={navElement.drawerIconPath} />
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
									<Icon class={navElement.drawerIconPath} />
								{/if}
							</svelte:fragment>
							<svelte:fragment slot="arrowup">
								<Icon class="i-mdi-chevron-up" />
							</svelte:fragment>
							<svelte:fragment slot="arrowdown">
								<Icon class="i-mdi-chevron-down" />
							</svelte:fragment>
							{#each navElement.elements.filter((navSubElement) => navSubElement.isPublic || sessionUser) as navSubElement}
								<SidebarItem
									label={navSubElement.title}
									active={$page.url.pathname == navSubElement.url}
									href={navSubElement.url}
									class="pl-8"
									on:click={() => isDrawerHidden.set(true)}
								>
									<svelte:fragment slot="icon">
										{#if navSubElement.drawerIconPath}
											<Icon class={navSubElement.drawerIconPath} />
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
