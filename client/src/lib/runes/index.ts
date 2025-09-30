import { rune } from './utils/rune-ify.svelte';
import { useToggleable } from './utils/toggleable';

export * from './context.rune.svelte';
export * from './theme.rune.svelte';
export * from './utils/rune-ify.svelte';

export const isDrawerOpen = useToggleable(rune(false), (drawerOpenRune) => (drawerOpenRune.value = !drawerOpenRune.value));
