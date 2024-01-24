import { flashStore } from '$lib/utils/flash';
import type { Toast } from 'flowbite-svelte';

export const defaultToastTimeout = 10000;

export type ToastAlertType = 'info' | 'warning' | 'error';

export type ToastManagerData = {
	text: string;
	type?: ToastAlertType;
	icon?: string;
	classes?: string;
	timeout?: number;
	/** Adds extra data under the main text. Warning: Data formatted as html. */
	extraData?: string;
	i18nPayload?: Record<string, unknown>;
};

export type ToastData = ToastManagerData & {
	id: string;
	type: ToastAlertType;
	open: boolean;
	markedForDeletion: boolean;
	timeoutId?: ReturnType<typeof setTimeout>;
};

export function createToasts(...toastsData: ToastManagerData[]): ToastData[] {
	if (!toastsData?.length) {
		return [];
	}

	const toasts = toastsData.map((toastManagerData) => {
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
			const mapping: Record<ToastAlertType, string> = {
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

export const toastColorMapping: Record<ToastAlertType, Toast['$$prop_def']['color']> = {
	info: 'blue',
	warning: 'yellow',
	error: 'red',
};
export const toastBorderColorMapping: Record<ToastAlertType, string> = {
	info: 'border-blue-400',
	warning: 'border-yellow-400',
	error: 'border-red-400',
};

export function setPageToasts(toasts: ToastData[]) {
	const flash = flashStore();

	flash?.update(($flash) => {
		if (!$flash) {
			$flash = {};
		}

		$flash.toasts = toasts;

		return $flash;
	});
}
