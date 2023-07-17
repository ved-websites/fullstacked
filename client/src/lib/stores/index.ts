import { writable } from 'svelte/store';
import { useLocalStorage } from './local-storage';
import { useToggleable } from './toggleable';

export const isDrawerHidden = useToggleable(writable(true), (drawerOpenStore) => drawerOpenStore.update((isOpen) => !isOpen));
export const sessionToken = useLocalStorage('auth_session');

export * from './local-storage';
export * from './matchMedia';
export * from './theme';
