import { convertRawRoutesInfo } from '$/lib/utils/routes';
import type { LayoutServerLoad } from './$types';

export type RouteInfo = {
	url: string;
	name: string;
	icon?: string;
	parents: string[];
	subroutes?: RouteInfo[];
};

const rawSettingPages = import.meta.glob('./**/+page.svelte', { eager: true });

const routesInfo = convertRawRoutesInfo<RouteInfo>(rawSettingPages, ({ component, route, parents, fullRoute }) => {
	if (!('name' in component) || typeof component.name !== 'string') {
		throw `Processed setting route "${route}" does not contain a 'name' module export of type string!`;
	}

	const icon = 'icon' in component && typeof component.icon === 'string' ? component.icon : undefined;

	return {
		url: `/settings/${fullRoute}`,
		name: component.name,
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
