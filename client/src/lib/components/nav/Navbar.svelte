<script lang="ts">
	import type { SessionUser } from '$/auth/auth-handler';
	import { getProfilePictureImageUrl } from '$/lib/utils/images';
	import { navElements } from '$/navigation/routes';
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { isDrawerHidden } from '$lib/stores';
	import { Avatar, Button, Dropdown, DropdownHeader, DropdownItem, NavBrand, NavHamburger, NavLi, NavUl, Navbar } from 'flowbite-svelte';
	import DarkMode from '../DarkMode.svelte';
	import Icon from '../Icon.svelte';
	import Drawer from './Drawer.svelte';
	import { isNavElemVisible } from './utils';

	export let sessionUser: SessionUser;

	$: activeUrl = $page.url.pathname;
</script>

<Navbar
	let:hidden
	navClass="px-1 sm:px-3 py-2.5 fixed w-full z-20 top-0 left-0 border-b"
	navDivClass="mx-auto flex justify-between items-center"
>
	<NavHamburger on:click={isDrawerHidden.toggle} />
	<NavBrand href="/">
		<img src="/images/logo.svg" width="30px" class="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite</span>
	</NavBrand>
	<div class="flex items-center md:order-2">
		<DarkMode class="mr-3 hidden md:flex" />
		{#if sessionUser}
			<Avatar class="cursor-pointer" id="avatar-menu" src={getProfilePictureImageUrl(sessionUser.profilePictureRef)} />

			<form method="POST" action="/?/logout" use:enhance>
				<Button type="submit" outline={true} class="!p-2 ml-3" size="lg">
					<Icon class="i-mdi-logout" />
				</Button>
			</form>

			{#if browser}
				<Dropdown placement="bottom" triggeredBy="#avatar-menu" class="py-2">
					<DropdownHeader>
						<span class="block text-sm">{sessionUser.firstName} {sessionUser.lastName}</span>
						<span class="block truncate text-sm font-light"> {sessionUser.email} </span>
					</DropdownHeader>
					<DropdownItem href="/settings">Settings</DropdownItem>
				</Dropdown>
			{/if}
		{:else}
			<Button href="/login" class={sessionUser ? 'hidden' : ''}>Login</Button>
		{/if}
	</div>
	<NavUl {hidden} {activeUrl}>
		{#each navElements as navElement}
			{#if isNavElemVisible(navElement, sessionUser)}
				{#if 'url' in navElement}
					<NavLi href={navElement.url}>
						{navElement.title}
					</NavLi>
				{:else}
					{@const isActive = navElement.elements.some((navSubElement) => $page.url.pathname == navSubElement.url)}
					{@const activeClasses = isActive
						? ` text-white bg-primary-700 md:bg-transparent md:text-primary-700 md:dark:text-white dark:bg-primary-600 md:dark:bg-transparent`
						: ''}
					<NavLi id={navElement.id} class="cursor-pointer flex items-center{activeClasses}">
						{navElement.title}
						<Icon class="i-mdi-chevron-down"></Icon>
					</NavLi>
					{#if browser}
						<Dropdown triggeredBy="#{navElement.id}" class="py-2 w-44 z-20" {activeUrl}>
							{#each navElement.elements as navSubElement}
								<DropdownItem href={navSubElement.url}>{navSubElement.title}</DropdownItem>
							{/each}
						</Dropdown>
					{/if}
				{/if}
			{/if}
		{/each}
	</NavUl>
</Navbar>

<Drawer {sessionUser} />
