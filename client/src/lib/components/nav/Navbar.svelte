<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { contextPublic } from '$lib/runes';
	import { isDrawerOpen } from '$lib/stores';
	import { cn } from '$lib/twMerge';
	import { navElements } from '$navigation/routes';
	import {
		Button,
		Dropdown,
		DropdownGroup,
		DropdownHeader,
		DropdownItem,
		NavBrand,
		NavHamburger,
		NavLi,
		NavUl,
		Navbar,
	} from 'flowbite-svelte';
	import DarkMode from '../DarkMode.svelte';
	import Icon from '../Icon.svelte';
	import UserAvatar from '../UserAvatar.svelte';
	import Drawer from './Drawer.svelte';
	import WsIssue from './WsIssue.svelte';
	import { isNavElemVisible } from './utils';

	let {
		i18n: { t },
		sessionUser,
	} = $derived(contextPublic());
</script>

<Navbar class="sm:px-3 fixed w-[100vw] z-20 top-0 left-0 border-b bg-white dark:bg-gray-900" navContainerClass="py-0">
	{#snippet children()}
		<NavHamburger onclick={isDrawerOpen.toggle} />
		<NavBrand href="/" class="ml-1 md:ml-0">
			<img src="/images/logo.svg" width="30px" class="mr-3 h-9" alt="Flowbite Logo" />
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite</span>
		</NavBrand>
		<NavUl activeUrl={page.url.pathname} classes={{ ul: 'py-2' }}>
			{#each navElements as navElement}
				{#if isNavElemVisible(navElement, sessionUser)}
					{#if 'url' in navElement}
						<NavLi href={navElement.url}>
							{$t(navElement.title)}
						</NavLi>
					{:else}
						{@const isActive = navElement.elements.some((navSubElement) => page.url.pathname == navSubElement.url)}
						{@const activeClasses =
							isActive &&
							`text-white bg-primary-700 md:bg-transparent md:text-primary-700 md:dark:text-white dark:bg-primary-600 md:dark:bg-transparent`}
						<NavLi id={navElement.id} class={cn('cursor-pointer flex items-center', activeClasses)}>
							{$t(navElement.title)}
							<Icon class="i-mdi-chevron-down"></Icon>
						</NavLi>
						{#if browser}
							<Dropdown triggeredBy="#{navElement.id}" class="w-44 z-20" activeUrl={page.url.pathname}>
								<DropdownGroup>
									{#each navElement.elements as navSubElement}
										<DropdownItem href={navSubElement.url}>{$t(navSubElement.title)}</DropdownItem>
									{/each}
								</DropdownGroup>
							</Dropdown>
						{/if}
					{/if}
				{/if}
			{/each}
		</NavUl>
		<div class="flex gap-3 items-center">
			<WsIssue />
			<DarkMode class="hidden md:flex" />
			{#if sessionUser}
				<UserAvatar {...sessionUser} avatarProps={{ class: 'cursor-pointer', id: 'avatar-menu' }} />

				<form method="POST" action="/?/logout" use:enhance>
					<Button type="submit" outline={true} class="!p-2" size="lg">
						<Icon class="i-mdi-logout" />
					</Button>
				</form>
			{:else}
				<Button href="/login">{$t('navbar.login')}</Button>
			{/if}
		</div>
	{/snippet}
</Navbar>

{#if browser && sessionUser}
	<Dropdown placement="bottom" triggeredBy="#avatar-menu">
		<DropdownHeader>
			<span class="block text-sm">{sessionUser.fullName}</span>
			<span class="block truncate text-sm font-light"> {sessionUser.email} </span>
		</DropdownHeader>
		<DropdownGroup>
			<DropdownItem href="/settings">{$t('navbar.user.links.settings')}</DropdownItem>
		</DropdownGroup>
	</Dropdown>
{/if}

<Drawer />
