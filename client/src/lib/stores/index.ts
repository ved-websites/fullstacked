import { writable } from 'svelte/store';
import { useLocalStorage } from './utils/storage/local-storage';
import { useToggleable } from './utils/toggleable';

export const isDrawerHidden = useToggleable(writable(true), (drawerOpenStore) => drawerOpenStore.update((isOpen) => !isOpen));
export const sessionToken = useLocalStorage('auth_session');

export * from './theme';
export * from './utils/matchMedia';
export * from './utils/storage/local-storage';
