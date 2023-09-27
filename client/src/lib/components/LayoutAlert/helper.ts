import type { Alert } from 'flowbite-svelte';

export type LayoutAlertLevel = 'info' | 'warning' | 'error';

export type LayoutAlertData = {
	text: string;
	/** The Alert behavior. Defaults to 'info'. */
	level: LayoutAlertLevel;
	/** The icon class to use from `iconify`. Defaults to level aware icon. */
	icon: string;
};

export function createLayoutAlert(data: Required<Pick<LayoutAlertData, 'text'>> & Partial<LayoutAlertData>): LayoutAlertData {
	const layoutAlert = data as LayoutAlertData;

	if (!data.level) {
		layoutAlert.level = 'info';
	}

	if (!layoutAlert.icon) {
		const mapping: Record<LayoutAlertLevel, string> = {
			info: 'i-mdi-information',
			warning: 'i-mdi-help-rhombus',
			error: 'i-mdi-alert',
		};

		layoutAlert.icon = mapping[layoutAlert.level]!;
	}

	return layoutAlert;
}

export const alertColorMapping: Record<LayoutAlertLevel, Alert['$$prop_def']['color']> = {
	info: 'blue',
	warning: 'yellow',
	error: 'red',
};

export const layoutAlertContextKey = 'layoutAlert';
export type LayoutAlertContextStore = LayoutAlertData | undefined;
