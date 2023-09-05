import type { LayoutAlertData } from '../components/LayoutAlert/helper';
import type { ToastData } from '../components/ToastManager/helper';

export type PageDataObject = {
	toasts?: ToastData[];
	layoutAlert?: LayoutAlertData | null;
	[x: string]: unknown;
};

export function createPageDataObject<T extends PageDataObject>(data: T) {
	return data;
}
