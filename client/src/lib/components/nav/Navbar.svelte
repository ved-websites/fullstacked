<script lang="ts">
	import type { ClientUser } from '$/hooks.server';
	import { navElements } from '$/navigation';
	import { browser } from '$app/environment';
	import { applyAction, enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { isDrawerHidden, sessionToken } from '$lib/stores';
	import { mdiLogout } from '@mdi/js';
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
	import Icon from '../Icon.svelte';
	import Drawer from './Drawer.svelte';
	import { isNavElemVisible } from './utils';

	export let sessionUser: ClientUser;

	const enhanceLogout: Parameters<typeof enhance>[1] = () => {
		return async ({ result }) => {
			if (result.type == 'success' || result.type == 'redirect') {
				sessionToken.set(null);
			}

			await applyAction(result);
		};
	};
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
			<Avatar class="cursor-pointer" id="avatar-menu" src="https://static-00.iconduck.com/assets.00/user-icon-2048x2048-ihoxz4vq.png" />

			<form method="POST" action="/?/logout" use:enhance={enhanceLogout}>
				<Button type="submit" outline={true} class="!p-2 ml-3" size="lg">
					<Icon path={mdiLogout} />
				</Button>
			</form>

			{#if browser}
				<Dropdown placement="bottom" triggeredBy="#avatar-menu">
					<DropdownHeader>
						<span class="block text-sm">{sessionUser.firstName} {sessionUser.lastName}</span>
						<span class="block truncate text-sm font-light"> {sessionUser.email} </span>
					</DropdownHeader>
					<DropdownItem>Dashboard</DropdownItem>
					<DropdownItem>Earnings</DropdownItem>
					<DropdownDivider />
					<DropdownItem>Settings</DropdownItem>
				</Dropdown>
			{/if}
		{:else}
			<Button href="/login" class={sessionUser ? 'hidden' : ''}>Login</Button>
		{/if}
	</div>
	<NavUl {hidden}>
		{#each navElements as navElement}
			{#if isNavElemVisible(navElement, sessionUser)}
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
					{#if browser}
						<Dropdown triggeredBy="#{navElement.id}" class="w-44 z-20">
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
