import type BreakpointVariants from 'svelte-materialify/src/utils/breakpoints';
import { writable } from 'svelte/store';
import { makeRefreshable } from './refreshable';
import { makeToggleable } from './toggleable';

let breakpoints: typeof BreakpointVariants | undefined = undefined;

export function setBreakpoints(newBreakpoints: typeof BreakpointVariants): void {
	breakpoints = newBreakpoints;
}

export const isDrawerOpen = makeToggleable(writable(false), (drawerOpenStore) => drawerOpenStore.update((isOpen) => !isOpen));
export const isMobile = makeRefreshable(writable(true), (isMobileStore) => {
	return breakpoints ? isMobileStore.set(window.matchMedia(breakpoints['md-and-down']).matches) : true;
});

export * from './local-storage';
export * from './theme';
