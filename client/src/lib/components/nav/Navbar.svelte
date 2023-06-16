<script lang="ts">
	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		Avatar,
		Dropdown,
		DropdownItem,
		DropdownHeader,
		DropdownDivider,
		Button,
		Chevron,
	} from 'flowbite-svelte';
	import { page } from '$app/stores';
	import DarkMode from '../DarkMode.svelte';
	import { navElements } from '$/navigation';
	import Drawer from './Drawer.svelte';
	import { isDrawerHidden } from '$lib/stores';

	export let session: any | null;
</script>

<Navbar let:hidden navClass="px-2 sm:px-4 py-2.5 fixed w-full z-20 top-0 left-0 border-b">
	<NavHamburger on:click={isDrawerHidden.toggle} />
	<NavBrand href="/">
		<img src="/images/logo.svg" class="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite</span>
	</NavBrand>
	<div class="flex items-center md:order-2">
		<DarkMode class="mr-3 hidden md:flex" />
		{#if session}
			<Avatar id="avatar-menu" src="https://static-00.iconduck.com/assets.00/user-icon-2048x2048-ihoxz4vq.png" />
		{:else}
			<Button href="/login" class={session ? 'hidden' : ''}>Login</Button>
		{/if}
	</div>
	{#if session}
		<Dropdown placement="bottom" triggeredBy="#avatar-menu">
			<DropdownHeader>
				<span class="block text-sm"> {session?.user.user_metadata.name} </span>
				<span class="block truncate text-sm font-medium"> {session?.user.email} </span>
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
			{#if navElement.isPublic || session}
				{#if 'url' in navElement}
					<NavLi href={navElement.url} active={$page.url.pathname == navElement.url}>
						{navElement.title}
					</NavLi>
				{:else}
					<NavLi
						id={navElement.id}
						class="cursor-pointer"
						active={navElement.elements.some((navSubElement) => $page.url.pathname == navSubElement.url)}
						><Chevron aligned>{navElement.title}</Chevron></NavLi
					>
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
