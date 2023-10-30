import type { Config } from 'sveltekit-i18n';

/**
 * Map of translation keys to routes data.
 *
 * Edit this file to make keys only load on specified routes (can be regex).
 */
export const routing: Record<string, NonNullable<Config['loaders']>[number]['routes']> = {
	home: ['/'],
	'settings.profil': [/\/settings.*/],
	'settings.security': [/\/settings.*/],
	'settings.experience': [/\/settings.*/],
	'admin.users.new': ['/admin/users/new'],
	'(auth).forgot_password': ['/forgot_password', '/login'],
};
