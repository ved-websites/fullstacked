import type { SessionUser } from '$auth/auth-handler';
import { writable } from 'svelte/store';
import { createStoreContext } from './utils/context';
import { useToggleable } from './utils/toggleable';

export const isDrawerHidden = useToggleable(writable(true), (drawerOpenStore) => drawerOpenStore.update((isOpen) => !isOpen));

export const { getStore: getSessionUser, setStore: setSessionUser } = createStoreContext<SessionUser>();

export * from './theme';
export * from './utils/matchMedia';
export * from './utils/storage/local-storage';
