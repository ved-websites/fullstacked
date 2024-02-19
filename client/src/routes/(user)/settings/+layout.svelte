<script lang="ts">
	import { page } from '$app/stores';
	import type { ConfirmedSessionUser } from '$auth/auth-handler.js';
	import { getI18n } from '$i18n';
	import Icon from '$lib/components/Icon.svelte';
	import UserAvatar from '$lib/components/UserAvatar.svelte';
	import { getSessionUser } from '$lib/stores/index.js';
	import { findDeepRoute } from '$lib/utils/routes.js';
	import { Heading, P, Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
	let i18n = getI18n();
	$: ({ t } = $i18n);

	export let data;

	$: activeUrl = $page.url.pathname.replace('/settings/', '');
	$: currentRoute = findDeepRoute(data.routesInfo, activeUrl);

	let sessionUser = getSessionUser<ConfirmedSessionUser>();
	$: label = currentRoute && ($t(`settings.${currentRoute.name}.name`) as string);
</script>

<header class="flex gap-5 mb-5">
	<UserAvatar {...$sessionUser} />
	<P size="lg" class="self-center">
		{#if $sessionUser.fullName}
			{$sessionUser.fullName} ({$sessionUser.email})
		{:else}
			{$sessionUser.email}
		{/if}
	</P>
</header>

<div class="flex gap-10 flex-col md:flex-row">
	<section>
		<Sidebar {activeUrl} class="w-full md:w-64">
			<SidebarWrapper>
				<SidebarGroup>
					{#each data.routesInfo as route}
						<SidebarItem href={route.url} label={$t(`settings.${route.name}.name`)} active={activeUrl === route.url}>
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
	<section class="grow flex flex-col gap-5">
		{#if label}
			<Heading tag="h2">{label}</Heading>
		{/if}
		<slot />
	</section>
</div>
