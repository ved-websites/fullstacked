<script lang="ts">
	import { isDrawerOpen, isMobile } from '$/stores';
	import { mdiChevronUp, mdiCog, mdiHome } from '@mdi/js';
	import Icon from 'svelte-materialify/src/components/Icon/Icon.svelte';
	import List from 'svelte-materialify/src/components/List/List.svelte';
	import ListGroup from 'svelte-materialify/src/components/List/ListGroup.svelte';
	import ListItem from 'svelte-materialify/src/components/List/ListItem.svelte';
	import NavigationDrawer from 'svelte-materialify/src/components/NavigationDrawer/NavigationDrawer.svelte';
	import Overlay from 'svelte-materialify/src/components/Overlay/Overlay.svelte';

	let active: boolean = false;
</script>

<NavigationDrawer fixed active={!$isMobile || $isDrawerOpen} class="drawer">
	<List>
		<ListItem>
			<span slot="prepend">
				<Icon path={mdiHome} />
			</span>
			Home
		</ListItem>
		<ListGroup bind:active offset={72}>
			<span slot="prepend">
				<Icon path={mdiCog} />
			</span>
			<span slot="activator"> Actions </span>
			<span slot="append">
				<Icon path={mdiChevronUp} rotate={active ? 0 : 180} />
			</span>
			<ListItem>Create</ListItem>
			<ListItem>Read</ListItem>
			<ListItem>Write</ListItem>
			<ListItem>Delete</ListItem>
		</ListGroup>
	</List>
</NavigationDrawer>

<Overlay active={$isMobile && $isDrawerOpen} on:click={isDrawerOpen.toggle} index={1} />

<style>
	:global(.drawer:root) {
		--s-list-group-offset: 72px;

		height: calc(100vh - var(--s-nav-clipped-height));
		top: var(--s-nav-clipped-height);
	}
</style>
