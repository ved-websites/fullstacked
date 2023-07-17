import { mdiAlert, mdiHelpRhombus, mdiInformation } from '@mdi/js';

export type LayoutAlertLevel = 'info' | 'warning' | 'error';

export type LayoutAlert = {
	text: string;
	/** The Alert behavior. Defaults to 'info'. */
	level: LayoutAlertLevel;
	/** The icon path to use from `@mdj/js`. Defaults to level aware icon. */
	icon: string;
};

export function createLayoutAlert(data: Required<Pick<LayoutAlert, 'text'>> & Partial<LayoutAlert>): LayoutAlert {
	const layoutAlert: LayoutAlert = data as LayoutAlert;

	if (!data.level) {
		layoutAlert.level = 'info';
	}

	if (layoutAlert && !layoutAlert.icon) {
		const mapping: Record<LayoutAlertLevel, string> = {
			info: mdiInformation,
			warning: mdiHelpRhombus,
			error: mdiAlert,
		};

		layoutAlert.icon = mapping[layoutAlert.level]!;
	}

	return layoutAlert;
}
