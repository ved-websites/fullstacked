import { writable } from 'svelte/store';
import type { LayoutAlertData } from '../components/LayoutAlert/helper';
import type { ToastData } from '../components/ToastManager/helper';
import { useToggleable } from './utils/toggleable';

export const isDrawerHidden = useToggleable(writable(true), (drawerOpenStore) => drawerOpenStore.update((isOpen) => !isOpen));

export const layoutAlertStore = writable<LayoutAlertData>();
export const toastsStore = writable<ToastData[]>([]);

export * from './theme';
export * from './utils/matchMedia';
export * from './utils/storage/local-storage';
