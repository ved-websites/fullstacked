<script lang="ts">
	import type { ClientUser } from '$/hooks.server';
	import Icon from '$/lib/components/Icon.svelte';
	import { getProfilePictureImageUrl } from '$/lib/utils/images';
	import { page } from '$app/stores';
	import { mdiAccount } from '@mdi/js';
	import { Avatar, P, Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';

	export let sessionUser: NonNullable<ClientUser>;

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

<div class="flex gap-10 flex-col sm:flex-row">
	<section>
		<Sidebar {activeUrl} asideClass="w-full sm:w-64">
			<SidebarWrapper>
				<SidebarGroup>
					<SidebarItem href="/settings/profile" label="Profile">
						<svelte:fragment slot="icon">
							<Icon path={mdiAccount} />
						</svelte:fragment>
					</SidebarItem>
				</SidebarGroup>
			</SidebarWrapper>
		</Sidebar>
	</section>
	<section class="grow">
		<slot />
	</section>
</div>
