<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { getI18n } from '$i18n';
	import { getSessionUser, isDrawerHidden } from '$lib/stores';
	import { twMerge } from '$lib/twMerge';
	import { navElements } from '$navigation/routes';
	import { Button, Dropdown, DropdownHeader, DropdownItem, NavBrand, NavHamburger, NavLi, NavUl, Navbar } from 'flowbite-svelte';
	import DarkMode from '../DarkMode.svelte';
	import Icon from '../Icon.svelte';
	import UserAvatar from '../UserAvatar.svelte';
	import Drawer from './Drawer.svelte';
	import WsIssue from './WsIssue.svelte';
	import { isNavElemVisible } from './utils';
	let i18n = getI18n();
	$: ({ t } = $i18n);

	let sessionUser = getSessionUser();

	$: activeUrl = $page.url.pathname;
</script>

<Navbar let:hidden class="pl-1 pr-4 sm:px-3 py-2.5 fixed w-[100vw] z-20 top-0 left-0 border-b">
	<NavHamburger onClick={isDrawerHidden.toggle} />
	<NavBrand href="/">
		<img src="/images/logo.svg" width="30px" class="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite</span>
	</NavBrand>
	<NavUl {hidden} {activeUrl}>
		{#each navElements as navElement}
			{#if isNavElemVisible(navElement, $sessionUser)}
				{#if 'url' in navElement}
					<NavLi href={navElement.url}>
						{$t(navElement.title)}
					</NavLi>
				{:else}
					{@const isActive = navElement.elements.some((navSubElement) => $page.url.pathname == navSubElement.url)}
					{@const activeClasses =
						isActive &&
						`text-white bg-primary-700 md:bg-transparent md:text-primary-700 md:dark:text-white dark:bg-primary-600 md:dark:bg-transparent`}
					<NavLi id={navElement.id} class={twMerge('cursor-pointer flex items-center', activeClasses)}>
						{$t(navElement.title)}
						<Icon class="i-mdi-chevron-down"></Icon>
					</NavLi>
					{#if browser}
						<Dropdown triggeredBy="#{navElement.id}" class="py-2 w-44 z-20" {activeUrl}>
							{#each navElement.elements as navSubElement}
								<DropdownItem href={navSubElement.url}>{$t(navSubElement.title)}</DropdownItem>
							{/each}
						</Dropdown>
					{/if}
				{/if}
			{/if}
		{/each}
	</NavUl>
	<div class="flex gap-3 items-center">
		<WsIssue />
		<DarkMode class="hidden md:flex" />
		{#if $sessionUser}
			<UserAvatar {...$sessionUser} class="cursor-pointer" id="avatar-menu" />

			<form method="POST" action="/?/logout" use:enhance>
				<Button type="submit" outline={true} class="!p-2" size="lg">
					<Icon class="i-mdi-logout" />
				</Button>
			</form>
		{:else}
			<Button href="/login" class={$sessionUser ? 'hidden' : ''}>{$t('navbar.login')}</Button>
		{/if}
	</div>
</Navbar>

{#if browser && $sessionUser}
	<Dropdown placement="bottom" triggeredBy="#avatar-menu" class="py-2">
		<DropdownHeader>
			<span class="block text-sm">{$sessionUser.firstName} {$sessionUser.lastName}</span>
			<span class="block truncate text-sm font-light"> {$sessionUser.email} </span>
		</DropdownHeader>
		<DropdownItem href="/settings">{$t('navbar.user.links.settings')}</DropdownItem>
	</Dropdown>
{/if}

<Drawer />
