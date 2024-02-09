import { convertRawRoutesInfo } from '$lib/utils/routes';
import type { LayoutServerLoad } from './$types';
import type { SettingsRouteMeta } from './types';

export type SettingsRouteInfo = {
	url: string;
	name: string;
	icon?: string;
};

const rawSettingPages = import.meta.glob('./**/+page.svelte', { eager: true });

const routesInfo = convertRawRoutesInfo<SettingsRouteMeta, SettingsRouteInfo>(rawSettingPages, ({ meta, route }) => {
	return {
		url: `/settings/${route}`,
		name: route.replaceAll('/', '.'),
		icon: meta?.icon,
	};
});

export const load = (async ({ parent }) => {
	const data = await parent();

	return {
		...data,
		routesInfo,
	};
}) satisfies LayoutServerLoad;
