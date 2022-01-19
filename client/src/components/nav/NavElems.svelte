<script lang="ts">
	import { isActive, url } from '@roxi/routify';

	export let nodes: ClientNodeApi[];

	$: formattedNodes = nodes.map((node) => ({ path: node.path, title: node.title, isActive: $isActive(node.path) }));
</script>

{#each formattedNodes as { path, title, isActive }}
	<a
		href={$url(path)}
		class="nav-link {isActive
			? 'text-white bg-gray-900'
			: 'text-gray-300 hover:(bg-gray-700 text-white)'} px-3 py-2 block rounded-md text-base sm:text-sm font-medium my-auto"
	>
		{title}
	</a>
{/each}

<style>
	.nav-link {
		@apply capitalize;
	}
</style>
