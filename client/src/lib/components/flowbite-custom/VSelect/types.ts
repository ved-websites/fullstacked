import type { SelectOptionType } from 'flowbite-svelte';

export type VSelectOptionType = SelectOptionType<string> & {
	selected?: boolean;
};
