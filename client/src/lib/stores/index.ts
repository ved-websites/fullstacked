import { writable } from 'svelte/store';
import { useToggleable } from './utils/toggleable';

export const isDrawerHidden = useToggleable(writable(true), (drawerOpenStore) => drawerOpenStore.update((isOpen) => !isOpen));

export * from './theme';
export * from './utils/matchMedia';
export * from './utils/storage/local-storage';
