import type { Config } from 'sveltekit-i18n';

export type ManualRouting = NonNullable<Config['loaders']>[number]['routes'] | true;

/**
 * Map of translation keys to routes data.
 *
 * Edit this file to make keys only load on specified routes (can be regex).
 *
 * To prevent the default behavior of merging the file path's route, append
 * an exclamation mark to the route key (example: 'home' => 'home!').
 */
export const routing: Record<string, ManualRouting> = {
	common: true,
	'home!': ['/'],
	'settings.profile': [/\/settings.*/],
	'settings.security': [/\/settings.*/],
	'settings.experience': [/\/settings.*/],
};
