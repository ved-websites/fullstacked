<script lang="ts">
	import { page } from '$app/stores';
	import { getI18n } from '$i18n';
	import { getSessionUser, isDrawerHidden } from '$lib/stores';
	import { navElements } from '$navigation/routes';
	import { CloseButton, Drawer, Sidebar, SidebarDropdownWrapper, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
	import { sineIn } from 'svelte/easing';
	import DarkMode from '../DarkMode.svelte';
	import Icon from '../Icon.svelte';
	import { isNavElemVisible } from './utils';
	let i18n = getI18n();
	$: ({ t } = $i18n);

	let sessionUser = getSessionUser();

	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn,
	};
</script>

<Drawer transitionType="fly" {transitionParams} bind:hidden={$isDrawerHidden} id="main-drawer" class="max-w-max">
	<div class="flex items-center">
		<h5 id="drawer-label" class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">
			<Icon class="i-mdi-information mr-3" />
			{$t('navbar.drawer.header')}
		</h5>
		<CloseButton on:click={isDrawerHidden.toggle} class="mb-4" />
	</div>
	<Sidebar activeUrl={$page.url.pathname}>
		<SidebarWrapper>
			<SidebarGroup>
				{#each navElements.filter((navElement) => isNavElemVisible(navElement, $sessionUser)) as navElement}
					{#if 'url' in navElement}
						<SidebarItem label={$t(navElement.title)} href={navElement.url} on:click={() => isDrawerHidden.set(true)}>
							<svelte:fragment slot="icon">
								{#if navElement.drawerIconPath}
									<Icon class={navElement.drawerIconPath} />
								{/if}
							</svelte:fragment>
						</SidebarItem>
					{:else}
						<SidebarDropdownWrapper
							label={$t(navElement.title)}
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
							{#each navElement.elements.filter((navSubElement) => navSubElement.isPublic || $sessionUser) as navSubElement}
								<SidebarItem
									label={$t(navSubElement.title)}
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
