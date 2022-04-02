import type { RNode } from '@roxi/routify/typings/lib/common/RNode';
import type { RoutifyRuntime } from '@roxi/routify/typings/lib/runtime/Instance/RoutifyRuntime';

export type CommonNode = {
	rnode?: RNode<typeof RoutifyRuntime>;
	icon?: string;
	hidden?: boolean;
};

export type FormattedPageNode = CommonNode & {
	title: string;
	path: string;
	isDir: false;
};

export type FormattedDirNode = CommonNode & {
	title: string;
	children: RNode<typeof RoutifyRuntime>[];
	isDir: true;
};

export type FormattedNode = FormattedPageNode | FormattedDirNode;
