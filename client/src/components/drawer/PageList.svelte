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

	$: nodes = pageNodes.map((node) => {
		const nodeIsDir = node.children.length > 0;
		const indexNode = nodeIsDir ? node.children.find((child) => child.name == 'index') : undefined;
		const indexOrDirNode = indexNode ?? node;

		return {
			path: indexOrDirNode.path,
			children: node.children.filter((child) => child.name != 'index'),
			title: node.name,
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
	<!-- <Item href="javascript:void(0)" on:click={() => setActive('Inbox')} activated={active === 'Inbox'}>
		<Graphic aria-hidden="true">
			<Icon component={Svg} viewBox="0 0 24 24">
				<path fill="currentColor" d={mdiInboxArrowDown} />
			</Icon>
		</Graphic>
		<Text>Inbox</Text>
	</Item>
	<Item href="javascript:void(0)" on:click={() => setActive('Star')} activated={active === 'Star'}>
		<Graphic aria-hidden="true">
			<Icon component={Svg} viewBox="0 0 24 24">
				<path fill="currentColor" d={mdiStar} />
			</Icon>
		</Graphic>
		<Text>Star</Text>
	</Item>
	<Item href="javascript:void(0)" on:click={() => setActive('Sent Mail')} activated={active === 'Sent Mail'}>
		<Graphic aria-hidden="true">
			<Icon component={Svg} viewBox="0 0 24 24">
				<path fill="currentColor" d={mdiSend} />
			</Icon>
		</Graphic>
		<Text>Sent Mail</Text>
	</Item>
	<Item href="javascript:void(0)" on:click={() => setActive('Drafts')} activated={active === 'Drafts'}>
		<Graphic aria-hidden="true">
			<Icon component={Svg} viewBox="0 0 24 24">
				<path fill="currentColor" d={mdiFile} />
			</Icon>
		</Graphic>
		<Text>Drafts</Text>
	</Item>

	<Separator />
	<Subheader component={H6}>Labels</Subheader>
	<Item href="javascript:void(0)" on:click={() => setActive('Family')} activated={active === 'Family'}>
		<Graphic aria-hidden="true">
			<Icon component={Svg} viewBox="0 0 24 24">
				<path fill="currentColor" d={mdiBookmark} />
			</Icon>
		</Graphic>
		<Text>Family</Text>
	</Item>
	<Item href="javascript:void(0)" on:click={() => setActive('Friends')} activated={active === 'Friends'}>
		<Graphic aria-hidden="true">
			<Icon component={Svg} viewBox="0 0 24 24">
				<path fill="currentColor" d={mdiBookmark} />
			</Icon>
		</Graphic>
		<Text>Friend</Text>
	</Item>
	<Item href="javascript:void(0)" on:click={() => setActive('Work')} activated={active === 'Work'}>
		<Graphic aria-hidden="true">
			<Icon component={Svg} viewBox="0 0 24 24">
				<path fill="currentColor" d={mdiBookmark} />
			</Icon>
		</Graphic>
		<Text>Work</Text>
	</Item> -->
</List>
