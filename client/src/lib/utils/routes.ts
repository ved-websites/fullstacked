import type { ImportGlobFunction } from 'vite';

export type RawRouteInfo = {
	route: string;
	component: unknown;
};

export function getRawRoutesInfo(rawImports: ReturnType<ImportGlobFunction>) {
	const rawRoutesInfo = Object.entries(rawImports).map<RawRouteInfo>(([pagePath, component]) => ({
		route: pagePath.replace('/+page.svelte', '').replace('./', ''),
		component,
	}));

	return rawRoutesInfo;
}

type DefaultComponent = {
	default: new () => unknown;
	[x: string]: unknown;
};

type ConvertRawRouteInfoCallbackArgs = {
	fullRoute: string;
	component: DefaultComponent;
	route: string;
	parents: string[];
};

export function convertRawRoutesInfo<T>(
	rawImports: ReturnType<ImportGlobFunction>,
	converter: (data: ConvertRawRouteInfoCallbackArgs) => T | undefined,
): T[] {
	const rawRoutesInfo = getRawRoutesInfo(rawImports);

	const unfilteredValues = rawRoutesInfo.map<T | undefined>((rawRouteInfo) => {
		if (!rawRouteInfo.component || !(typeof rawRouteInfo.component === 'object')) {
			console.error(`Failed parsing given file. Does the "${rawRouteInfo.route}" svelte file is actually svelte?`);
			return undefined;
		}

		const [route, ...parents] = rawRouteInfo.route.split('/').reverse();

		if (parents?.length) {
			parents.reverse();
		}

		const args: ConvertRawRouteInfoCallbackArgs = {
			fullRoute: rawRouteInfo.route,
			component: rawRouteInfo.component as DefaultComponent,
			route: route ?? '',
			parents,
		};

		try {
			return converter(args);
		} catch (error) {
			console.log(error);
			return undefined;
		}
	});

	return unfilteredValues.filter((converted) => converted !== undefined) as T[];
}
