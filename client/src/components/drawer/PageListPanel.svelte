<script lang="ts">
	import { isDrawerOpen } from '$/stores';
	import { goto, isActive } from '@roxi/routify';
	import { Content, Header, Panel } from '@smui-extra/accordion';
	import { Icon } from '@smui/common';
	import type { FormattedDirNode, FormattedNode } from './types';

	export let node: FormattedNode;
	export let nested: number = 0;
	export let isParentOpened: boolean = false;

	function hasChildrenActive(rnode: FormattedNode['rnode']): boolean {
		if (!rnode) {
			return false;
		}

		if (rnode.children.length) {
			return rnode.children.some((child) => hasChildrenActive(child));
		}

		return $isActive(rnode.path);
	}

	function onNodeClick(node: FormattedNode, e: CustomEvent) {
		e.stopPropagation();

		if (node.isDir) {
			open = !open;
		} else {
			isDrawerOpen.set(false);
			$goto(node.path);
		}
	}

	let open: boolean = hasChildrenActive(node.rnode);

	/** dirnode to trick Svelte <slot> Types, only use after checking `node.isDir`! */
	const dirnode = node as FormattedDirNode;
</script>

<Panel
	color={!node.isDir && $isActive(node.rnode?.path ?? node.path, undefined, { recursive: false }) ? 'primary' : undefined}
	on:SMUIAccordionPanel:activate={(e) => onNodeClick(node, e)}
	style="border: none;"
	variant="unelevated"
	square
	{open}
>
	<Header tabindex={isParentOpened ? 0 : -1}>
		{#if node.icon}
			<div class="flex" style={`padding-left: ${20 * nested}px;`}>
				<Icon class="material-icons">{node.icon}</Icon>
				<span class="ml-3">{node.title}</span>
			</div>
		{:else}
			<span class="ml-9" style={`padding-left: ${20 * nested}px;`}>{node.title}</span>
		{/if}

		<svelte:fragment slot="icon">
			{#if node.isDir}
				<div class="flex items-center select-none">
					<Icon class="material-icons transform transition {open ? '-rotate-180' : ''}">expand_more</Icon>
				</div>
			{/if}
		</svelte:fragment>
	</Header>
	{#if node.isDir}
		<Content style="padding: 0; overflow: hidden;">
			<slot name="subnode" {dirnode} isDirOpen={open} />
		</Content>
	{/if}
</Panel>
