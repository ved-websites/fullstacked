<script lang="ts">
	import type { ClientUser } from '$/lib/utils/hooks-helper.server';
	import { navElements } from '$/navigation';
	import { page } from '$app/stores';
	import { isDrawerHidden } from '$lib/stores';
	import {
		Avatar,
		Button,
		Chevron,
		Dropdown,
		DropdownDivider,
		DropdownHeader,
		DropdownItem,
		NavBrand,
		NavHamburger,
		NavLi,
		NavUl,
		Navbar,
	} from 'flowbite-svelte';
	import DarkMode from '../DarkMode.svelte';
	import Drawer from './Drawer.svelte';

	export let user: ClientUser;
</script>

<Navbar let:hidden navClass="px-2 sm:px-4 py-2.5 fixed w-full z-20 top-0 left-0 border-b">
	<NavHamburger on:click={isDrawerHidden.toggle} />
	<NavBrand href="/">
		<img src="/images/logo.svg" class="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite</span>
	</NavBrand>
	<div class="flex items-center md:order-2">
		<DarkMode class="mr-3 hidden md:flex" />
		{#if user}
			<Avatar id="avatar-menu" src="https://static-00.iconduck.com/assets.00/user-icon-2048x2048-ihoxz4vq.png" />
		{:else}
			<Button href="/login" class={user ? 'hidden' : ''}>Login</Button>
		{/if}
	</div>
	{#if user}
		<Dropdown placement="bottom" triggeredBy="#avatar-menu">
			<DropdownHeader>
				<span class="block text-sm">{user.firstName} {user.lastName}</span>
				<span class="block truncate text-sm font-medium"> {user.email} </span>
			</DropdownHeader>
			<DropdownItem>Dashboard</DropdownItem>
			<DropdownItem>Settings</DropdownItem>
			<DropdownItem>Earnings</DropdownItem>
			<DropdownDivider />
			<DropdownItem>
				<form method="POST" action="/?/logout">
					<input type="submit" value="Logout" class="w-100 h-100" />
				</form>
			</DropdownItem>
		</Dropdown>
	{/if}
	<NavUl {hidden}>
		{#each navElements as navElement}
			{#if navElement.isPublic || user}
				{#if 'url' in navElement}
					<NavLi href={navElement.url} active={$page.url.pathname == navElement.url}>
						{navElement.title}
					</NavLi>
				{:else}
					<NavLi
						id={navElement.id}
						class="cursor-pointer"
						active={navElement.elements.some((navSubElement) => $page.url.pathname == navSubElement.url)}
					>
						<Chevron aligned>{navElement.title}</Chevron>
					</NavLi>
					<Dropdown triggeredBy="#{navElement.id}" class="w-44 z-20">
						{#each navElement.elements as navSubElement}
							<DropdownItem href={navSubElement.url}>{navSubElement.title}</DropdownItem>
						{/each}
					</Dropdown>
				{/if}
			{/if}
		{/each}
	</NavUl>
</Navbar>

<Drawer />
