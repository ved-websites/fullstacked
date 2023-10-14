import { convertRawRoutesInfo } from '$lib/utils/routes';
import type { LayoutServerLoad } from './$types';

export type RouteInfo = {
	url: string;
	name: string;
	icon?: string;
	parents: string[];
	subroutes?: RouteInfo[];
};

const rawSettingPages = import.meta.glob('./**/+page.svelte', { eager: true });

const routesInfo = convertRawRoutesInfo<RouteInfo>(rawSettingPages, ({ component, parents, fullRoute }) => {
	const icon = 'icon' in component && typeof component.icon === 'string' ? component.icon : undefined;

	return {
		url: `/settings/${fullRoute}`,
		name: fullRoute.replaceAll('/', '.'),
		icon,
		parents,
	};
});

export const load = (async ({ parent }) => {
	const data = await parent();

	return {
		...data,
		routesInfo,
	};
}) satisfies LayoutServerLoad;
