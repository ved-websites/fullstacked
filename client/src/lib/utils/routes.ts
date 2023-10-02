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
	index: number;
	order: number;
};

export function convertRawRoutesInfo<T>(
	rawImports: ReturnType<ImportGlobFunction>,
	converter: (data: ConvertRawRouteInfoCallbackArgs) => T | undefined,
): T[] {
	const rawRoutesInfo = getRawRoutesInfo(rawImports);

	const argsMap = rawRoutesInfo.map((rawRouteInfo, index) => {
		const component = rawRouteInfo.component as DefaultComponent | undefined;

		if (!component || !(typeof component === 'object')) {
			console.error(`Failed parsing given file. Does the "${rawRouteInfo.route}" svelte file is actually svelte?`);
			return undefined;
		}

		const [route, ...parents] = rawRouteInfo.route.split('/').reverse();

		if (parents?.length) {
			parents.reverse();
		}

		if ('order' in component && typeof component.order !== 'number') {
			throw `Component '${rawRouteInfo.route}' has defined an 'order' property that isn't a number!`;
		}

		const order = (component.order as number | undefined) ?? index;

		const args: ConvertRawRouteInfoCallbackArgs = {
			fullRoute: rawRouteInfo.route,
			component,
			route: route ?? '',
			parents,
			index,
			order,
		};

		return args;
	});

	type Args = NonNullable<(typeof argsMap)[number]>;

	const sortedArgsMap = argsMap
		.filter<Args>((converted): converted is Args => converted !== undefined)
		.sort((val1, val2) => {
			return val1!.order - val2!.order;
		});
	const unfilteredValues = sortedArgsMap.map((rawArgsData) => {
		try {
			return converter(rawArgsData);
		} catch (error) {
			console.error(error);
			return undefined;
		}
	});

	const filteredValues = unfilteredValues.filter((val): val is T => val !== undefined);

	return filteredValues;
}
