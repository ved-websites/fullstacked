<script lang="ts">
	import { capitalize } from '$/utils';
	import type { RNode } from '@roxi/routify/typings/lib/common/RNode';
	import type { RoutifyRuntime } from '@roxi/routify/typings/lib/runtime/Instance/RoutifyRuntime';
	import Accordion from '@smui-extra/accordion';
	import PageListPanel from './PageListPanel.svelte';
	import type { FormattedNode } from './types';

	export let initialNodes: FormattedNode[] = [];
	export let finalNodes: FormattedNode[] = [];

	export let pageNodes: RNode<typeof RoutifyRuntime>[];
	export let nested: number = 0;
	export let isParentOpened: boolean = true; // root list is always open

	function hasChildrenMetaNotHidden(rnode: typeof pageNodes[number]): boolean {
		if (rnode.children.length) {
			return rnode.children.some((child) => hasChildrenMetaNotHidden(child));
		}

		return !rnode.meta.hidden;
	}

	function formatNode(rnode: typeof pageNodes[number], forcedName?: string): FormattedNode {
		if (rnode.children.length) {
			const childNodes = rnode.children.filter(({ name }) => !name.startsWith('_'));

			if (childNodes.length == 1 && childNodes[0].name == 'index') {
				return formatNode(childNodes[0], childNodes[0].meta.name ?? rnode.name);
			}

			const children = childNodes.sort((rnodeA, rnodeB) => {
				// Automatically set index nodes as 0, unless defined manually.
				const a = rnodeA.name == 'index' ? rnodeA.meta.pos ?? 0 : rnodeA.meta.pos;
				const b = rnodeB.meta.pos;

				// Sort based on meta 'pos', putting defined pos first.
				// If neither pos are set, they will be ordered alphabetically.
				return (a != undefined ? a : Infinity) - (b != undefined ? b : Infinity);
			});

			// Any direct child can set the directory props, highest order wins
			const dirName = children.find(({ meta }) => meta.dirname)?.meta.dirname;
			const dirIcon = children.find(({ meta }) => meta.diricon)?.meta.diricon;

			return {
				rnode,
				title: capitalize(dirName ?? rnode.name.replace(/_/g, ' ')),
				isDir: true,
				icon: dirIcon,
				children,
				hidden: !hasChildrenMetaNotHidden(rnode),
			};
		}

		const name = forcedName ?? rnode.meta.name ?? (rnode.name == 'index' && rnode.meta.dirname ? rnode.parent.name : rnode.name);
		const path = rnode.path.endsWith('/index') ? rnode.path.slice(0, -'/index'.length) : rnode.path;

		return {
			rnode,
			isDir: false,
			title: capitalize(name.replace(/_/g, ' ')),
			path,
			icon: rnode.meta.icon,
			hidden: rnode.meta.hidden,
		};
	}

	let formattedNodes: FormattedNode[] = pageNodes.map((rnode) => formatNode(rnode));

	$: nodes = [...initialNodes, ...formattedNodes, ...finalNodes].filter((node) => !node.hidden);
</script>

<Accordion multiple>
	{#each nodes as node (node)}
		<PageListPanel {node} {nested} {isParentOpened}>
			<svelte:fragment slot="subnode" let:dirnode let:isDirOpen>
				<svelte:self pageNodes={dirnode.children} nested={nested + 1} isParentOpened={isDirOpen} />
			</svelte:fragment>
		</PageListPanel>
	{/each}
</Accordion>
