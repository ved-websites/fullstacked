import type { Config } from 'sveltekit-i18n';

/**
 * Map of translation keys to routes data.
 *
 * Edit this file to make keys only load on specified routes (can be regex).
 */
export const routing: Record<string, NonNullable<Config['loaders']>[number]['routes']> = {
	home: ['/'],
	'settings.experience': ['/settings/experience'],
};
