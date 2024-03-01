import type { SelectOptionType } from 'flowbite-svelte';

export type VSelectOptionType<T = string> = SelectOptionType<T> & {
	selected?: boolean;
};
