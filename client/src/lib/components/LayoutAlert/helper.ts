import { flashStore } from '$lib/utils/flash';
import type { AlertProps } from 'flowbite-svelte';

export type LayoutAlertType = 'info' | 'warning' | 'error';

export type LayoutAlertData = {
	text: string;
	/** The Alert behavior. Defaults to 'info'. */
	type: LayoutAlertType;
	/** The icon class to use from `iconify`. Defaults to level aware icon. */
	icon: string;
	i18nPayload: Record<string, unknown>;
};

export function createLayoutAlert(data: Required<Pick<LayoutAlertData, 'text'>> & Partial<LayoutAlertData>): LayoutAlertData {
	const layoutAlert = data as LayoutAlertData;

	if (!data.type) {
		layoutAlert.type = 'info';
	}

	if (!layoutAlert.icon) {
		const mapping: Record<LayoutAlertType, string> = {
			info: 'i-mdi-information',
			warning: 'i-mdi-help-rhombus',
			error: 'i-mdi-alert',
		};

		layoutAlert.icon = mapping[layoutAlert.type];
	}

	return layoutAlert;
}

export const alertColorMapping: Record<LayoutAlertType, AlertProps['color']> = {
	info: 'blue',
	warning: 'yellow',
	error: 'red',
};

export const layoutAlertContextKey = 'layoutAlert';
export type LayoutAlertContextStore = LayoutAlertData | undefined;

export function setPageLayoutAlert(layoutAlert: LayoutAlertData) {
	const flash = flashStore();

	flash?.update(($flash) => {
		if (!$flash) {
			$flash = {};
		}

		$flash.layoutAlert = layoutAlert;

		return $flash;
	});
}
