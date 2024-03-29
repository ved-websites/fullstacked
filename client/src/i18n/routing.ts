import type { RoutingMap } from '$i18n-config';

/**
 * Map of translation keys (files) to routes data.
 *
 * Edit this file to make keys only load on specified routes (can be regex).
 *
 * To prevent the default behavior of merging the file path's route, append
 * an exclamation mark to the route key (example: 'home' => 'home!').
 *
 * To mark a route as available everywhere, set the key's value to `true`.
 */
export const routing = {
	common: true,
	navbar: true,
	'home!': ['/'],
	'shared.userform!': [/\/settings\/profile.*/, /\/admin\/users.*/],
	'settings.profile': [/\/settings.*/],
	'settings.security': [/\/settings.*/],
	'settings.experience': [/\/settings.*/],
} satisfies RoutingMap;
