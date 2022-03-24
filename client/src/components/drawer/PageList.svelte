<script lang="ts">
	import { isDrawerOpen } from '$/stores';
	import { capitalize } from '$/utils';
	import { goto, isActive } from '@roxi/routify';
	import type { RNode } from '@roxi/routify/typings/lib/common/RNode';
	import type { RoutifyRuntime } from '@roxi/routify/typings/lib/runtime/Instance/RoutifyRuntime';
	import List, { Graphic, Item, Text } from '@smui/list';

	function gotoPath(path: string) {
		isDrawerOpen.set(false);
		$goto(path);
	}

	export let pageNodes: RNode<typeof RoutifyRuntime>[];

	const indexPath = '/index';
	const indexPathLength = indexPath.length;

	$: nodes = pageNodes.map((node) => {
		const nodeIsDir = node.children.length > 0;
		const indexNode = nodeIsDir ? node.children.find((child) => child.name == 'index') : undefined;
		const indexOrDirNode = indexNode ?? node;

		const path = indexOrDirNode.path.endsWith(indexPath) ? indexOrDirNode.path.slice(0, -indexPathLength) : indexOrDirNode.path;

		return {
			path,
			children: node.children.filter((child) => child.name != 'index'),
			title: node.name.replaceAll('_', ' '),
			meta: indexOrDirNode.meta,
			isActive: $isActive(indexOrDirNode.path),
		};
	});
</script>

<List>
	{#each nodes as node}
		<Item on:click={() => gotoPath(node.path)} activated={node.isActive}>
			{#if node.meta.icon}
				<Graphic aria-hidden="true" class="material-icons">{node.meta.icon}</Graphic>
			{/if}
			<Text>{capitalize(node.title)}</Text>
		</Item>
	{/each}
</List>
