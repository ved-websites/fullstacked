<script lang="ts">
	import type { SessionUser } from '$/auth/auth-handler';
	import Icon from '$/lib/components/Icon.svelte';
	import { getProfilePictureImageUrl } from '$/lib/utils/images';
	import { page } from '$app/stores';
	import { mdiAccount } from '@mdi/js';
	import { Avatar, Heading, P, Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';

	export let sessionUser: NonNullable<SessionUser>;
	export let label: string;

	$: activeUrl = $page.url.pathname;

	type VSidebarElement = {
		href: `/${string}`;
		label: string;
		icon?: string;
	};

	const items: VSidebarElement[] = [
		{
			href: '/settings/profile',
			label: 'Profile',
			icon: mdiAccount,
		},
	];
</script>

<header class="flex gap-5 mb-5">
	<Avatar id="settings-avatar" src={getProfilePictureImageUrl(sessionUser.profilePictureRef)} />
	<P size="lg" class="self-center">
		{#if sessionUser.firstName}
			{sessionUser.firstName}{sessionUser.lastName ? ` ${sessionUser.lastName}` : ''} ({sessionUser.email})
		{:else}
			{sessionUser.email}
		{/if}
	</P>
</header>

<div class="flex gap-10 flex-col md:flex-row">
	<section>
		<Sidebar {activeUrl} class="w-full md:w-64">
			<SidebarWrapper>
				<SidebarGroup>
					{#each items as item}
						<SidebarItem href={item.href} label={item.label} active={activeUrl === item.href}>
							<svelte:fragment slot="icon">
								{#if item.icon}
									<Icon path={item.icon} />
								{/if}
							</svelte:fragment>
						</SidebarItem>
					{/each}
				</SidebarGroup>
			</SidebarWrapper>
		</Sidebar>
	</section>
	<section class="grow" {...$$restProps}>
		<Heading tag="h2" class="mb-5">{label}</Heading>
		<slot />
	</section>
</div>
