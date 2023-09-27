<script lang="ts">
	import Icon from '$/lib/components/Icon.svelte';
	import { getProfilePictureImageUrl } from '$/lib/utils/images';
	import { page } from '$app/stores';
	import { Avatar, Heading, P, Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';

	export let data;

	$: sessionUser = data.sessionUser!;
	$: routesInfo = data.routesInfo;
	$: label = routesInfo.find(({ url }) => url === $page.url.pathname)?.name;

	$: activeUrl = $page.url.pathname;
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
					{#each routesInfo as route}
						<SidebarItem href={route.url} label={route.name} active={activeUrl === route.url}>
							<svelte:fragment slot="icon">
								{#if route.icon}
									<Icon class={route.icon} />
								{/if}
							</svelte:fragment>
						</SidebarItem>
					{/each}
				</SidebarGroup>
			</SidebarWrapper>
		</Sidebar>
	</section>
	<section class="grow">
		{#if label}
			<Heading tag="h2" class="mb-5">{label}</Heading>
		{/if}
		<slot />
	</section>
</div>
