<script lang="ts">
	import { page } from '$app/state';
	import Icon from '$lib/components/Icon.svelte';
	import UserAvatar from '$lib/components/UserAvatar.svelte';
	import { context } from '$lib/runes';
	import { findDeepRoute } from '$lib/utils/routes.js';
	import { Heading, P, Sidebar, SidebarGroup, SidebarItem } from 'flowbite-svelte';

	let {
		i18n: { t },
		sessionUser,
	} = context();

	let { data, children } = $props();

	let currentRoute = $derived(findDeepRoute(data.routesInfo, page.url.pathname.replace('/settings/', '')));

	let label = $derived(currentRoute && ($t(`settings.${currentRoute.name}.name`) as string));
</script>

<header class="flex gap-5 mb-5">
	<UserAvatar {...sessionUser} />
	<P size="lg" class="self-center">
		{#if sessionUser.fullName}
			{sessionUser.fullName} ({sessionUser.email})
		{:else}
			{sessionUser.email}
		{/if}
	</P>
</header>

<div class="flex gap-10 flex-col md:flex-row">
	<section>
		<Sidebar alwaysOpen={true} backdrop={false} position="static" activeUrl={page.url.pathname} class="z-50 w-full md:w-64">
			<SidebarGroup>
				{#each data.routesInfo as route}
					<SidebarItem href={route.url} label={$t(`settings.${route.name}.name`)}>
						{#snippet icon()}
							{#if route.icon}
								<Icon class={route.icon} />
							{/if}
						{/snippet}
					</SidebarItem>
				{/each}
			</SidebarGroup>
		</Sidebar>
	</section>
	<section class="grow flex flex-col gap-5">
		{#if label}
			<Heading tag="h2">{label}</Heading>
		{/if}
		{@render children?.()}
	</section>
</div>
