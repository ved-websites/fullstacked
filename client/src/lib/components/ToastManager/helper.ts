import { page } from '$app/stores';
import type { Toast } from 'flowbite-svelte';
import { getFlash } from 'sveltekit-flash-message/client';

export const defaultToastTimeout = 10000;

export type ToastAlertLevel = 'info' | 'warning' | 'error';

export type ToastManagerData = {
	text: string;
	type?: ToastAlertLevel;
	icon?: string;
	classes?: string;
	timeout?: number;
};

export type ToastData = ToastManagerData & {
	id: string;
	type: ToastAlertLevel;
	open: boolean;
	markedForDeletion: boolean;
	timeoutId?: ReturnType<typeof setTimeout>;
};

export function createToasts(data?: ToastManagerData[]): ToastData[] {
	if (!data?.length) {
		return [];
	}

	const toasts = data.map((toastManagerData) => {
		// eslint-disable-next-line @typescript-eslint/no-magic-numbers
		const toastId = (Math.random() + 1).toString(36).substring(7);

		const toast: ToastData = {
			...toastManagerData,
			id: toastId,
			type: toastManagerData.type ?? 'info',
			open: true,
			markedForDeletion: false,
		};

		if (!toast.icon) {
			const mapping: Record<ToastAlertLevel, string> = {
				info: 'i-mdi-information',
				warning: 'i-mdi-help-rhombus',
				error: 'i-mdi-alert',
			};

			toast.icon = mapping[toast.type]!;
		}

		// here, explicitely setting `undefined` makes the toast untimeable
		if (!('timeout' in toast)) {
			// 10 seconds default if toast has no timeout specified
			toast.timeout = defaultToastTimeout;
		}

		toast.open = true;

		return toast;
	});

	return toasts;
}

export const toastColorMapping: Record<ToastAlertLevel, Toast['$$prop_def']['color']> = {
	info: 'blue',
	warning: 'yellow',
	error: 'red',
};
export const toastBorderColorMapping: Record<ToastAlertLevel, string> = {
	info: 'border-blue-400',
	warning: 'border-yellow-400',
	error: 'border-red-400',
};

export function setPageToasts(toasts: ToastData[]) {
	const flash = getFlash(page);

	flash.update(($flash) => {
		if (!$flash) {
			$flash = {};
		}

		$flash.toasts = toasts;

		return $flash;
	});
}
