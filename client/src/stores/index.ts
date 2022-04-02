import { writable } from 'svelte/store';
import { makeToggleable } from './toggleable';

export const isDrawerOpen = makeToggleable(writable(false), (drawerOpenStore) => drawerOpenStore.update((isOpen) => !isOpen));

export * from './local-storage';
export * from './matchMedia';
export * from './theme';
