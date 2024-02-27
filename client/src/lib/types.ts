import type { LayoutAlertData } from './components/LayoutAlert/helper';
import type { ToastData } from './components/ToastManager/helper';

export interface PageMessages {
	toasts?: ToastData[];
	layoutAlert?: LayoutAlertData | null;
	[x: string]: unknown;
}

export type EventStep = 'hook' | 'action' | 'layout' | 'page' | 'resolved';
