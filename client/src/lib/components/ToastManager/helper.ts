import type { Toast } from 'flowbite-svelte';

export type ToastAlertLevel = 'info' | 'warning' | 'error';

export type ToastManagerData = {
	text: string;
	type: ToastAlertLevel;
	icon?: string;
	classes?: string;
};

export const toastColorMapping: Record<ToastAlertLevel, Toast['$$prop_def']['color']> = {
	info: 'blue',
	warning: 'yellow',
	error: 'red',
};
