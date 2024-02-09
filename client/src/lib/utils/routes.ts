import type { SvelteComponent } from 'svelte';
import type { ImportGlobFunction } from 'vite';

export type RouteMeta = {
	order?: number;
};

export type DefaultComponent<M extends RouteMeta> = {
	default: SvelteComponent;
	meta?: M;
	[x: string]: unknown;
};

export type RawRouteInfo<M extends RouteMeta> = {
	route: string;
	component: DefaultComponent<M>;
	level: number;
	children: RawRouteInfo<M>[];
};

export function getRawRoutesInfo<M extends RouteMeta>(rawImports: ReturnType<ImportGlobFunction>) {
	const rawRoutesInfo = Object.entries(rawImports).map<RawRouteInfo<M>>(([pagePath, component]) => {
		return {
			route: pagePath.replace('/+page.svelte', '').replace('./', ''),
			component: component as DefaultComponent<M>,
			children: [],
			level: 0,
		};
	});

	rawRoutesInfo.forEach((rawRouteInfo) => {
		const rawRouteInfoLeafs = rawRouteInfo.route.split('/');

		const level = rawRouteInfoLeafs.length - 1;

		if (level === 0) {
			return;
		}

		rawRouteInfo.level = level;

		const [, ...parents] = rawRouteInfoLeafs.reverse();

		const parentsRoute = parents.reverse().join('/');

		const parentRouteInfo = rawRoutesInfo.find((r) => r.route === parentsRoute);

		if (parentRouteInfo) {
			parentRouteInfo.children.push(rawRouteInfo);
		}
	});

	return rawRoutesInfo;
}

export type RouteInfo<M extends RouteMeta = RouteMeta> = RawRouteInfo<M> & {
	component: DefaultComponent<M>;
	route: string;
	index: number;
	order: number;
	meta: M | undefined;
	parents: RouteInfo<M>[];
	children: RouteInfo<M>[];
};

export type ConvertRawRouteInfoCallbackArgs<M extends RouteMeta, R> = {
	component: DefaultComponent<M>;
	route: string;
	index: number;
	order: number;
	meta: M | undefined;
	level: number;
	children: R[];
};

export type EnhancedRouteInfo<T extends object = object> = T & {
	route: string;
	order: number;
	children: EnhancedRouteInfo<T>[];
	parents?: EnhancedRouteInfo<T>[];
};

export type ConvertRawRouteInfoOptions = {
	/**
	 * Does not strip out the children in the top level array.
	 * @default false
	 */
	childrenInTopLevel: boolean;
};

export function convertRawRoutesInfo<M extends RouteMeta = RouteMeta, T extends object = RouteInfo<M>>(
	rawImports: ReturnType<ImportGlobFunction>,
	converter?: (data: ConvertRawRouteInfoCallbackArgs<M, Omit<EnhancedRouteInfo<T>, 'parents'>>) => T | undefined,
	options?: Partial<ConvertRawRouteInfoOptions>,
): EnhancedRouteInfo<T>[] {
	const topLevelRawRoutesInfo = getRawRoutesInfo<M>(rawImports);

	const convertedMark = '$$converted';

	const executeConvertion = (rawRoutesInfo: RawRouteInfo<M>[]): EnhancedRouteInfo<T>[] => {
		if (!rawRoutesInfo.length) {
			// @ts-expect-error Wrong type, but empty array so it doesn't matter
			return rawRoutesInfo;
		}

		const argsMap = rawRoutesInfo.map((rawRouteInfo, index) => {
			const children = executeConvertion(rawRouteInfo.children);

			// @ts-expect-error untyped temporary mark
			if (rawRouteInfo[convertedMark]) {
				// Only setup conversion for routes that are not already converted
				return undefined;
			}

			const component = rawRouteInfo.component;

			if (!component || !(typeof component === 'object')) {
				console.error(`Failed parsing given file. Is the "${rawRouteInfo.route}" svelte file actually a svelte component?`);
				return undefined;
			}

			if (component.meta?.order && typeof component.meta.order !== 'number') {
				console.log(`Component '${rawRouteInfo.route}' has defined an 'order' property that isn't a number!`);
				return undefined;
			}

			const order = component.meta?.order ?? index;

			const args = {
				route: rawRouteInfo.route,
				component,
				index,
				order,
				meta: component.meta,
				children,
				level: rawRouteInfo.level,
			} satisfies ConvertRawRouteInfoCallbackArgs<M, T>;

			return args;
		});

		for (let i = 0; i < rawRoutesInfo.length; i++) {
			const rawArgsData = argsMap[i];

			if (rawArgsData === undefined) {
				continue;
			}

			let routeInfoData: EnhancedRouteInfo<T>;

			try {
				const convertedRawArgData = converter?.(rawArgsData);

				routeInfoData = (
					convertedRawArgData
						? { route: rawArgsData.route, order: rawArgsData.order, children: rawArgsData.children, ...convertedRawArgData }
						: rawArgsData
				) as EnhancedRouteInfo<T>;

				// @ts-expect-error untyped temporary mark
				rawRoutesInfo[i]![convertedMark] = true;
			} catch (error) {
				console.error(error);
				continue;
			}

			const routeInfo = rawRoutesInfo[i]!;

			Object.keys(routeInfo).forEach((key) => {
				if (key in routeInfoData || ['children', convertedMark].includes(key)) {
					return;
				}

				delete routeInfo[key as keyof typeof routeInfo];
			});

			Object.entries(routeInfoData).forEach(([key, value]) => {
				if (key === 'children') {
					return;
				}

				if (!(key in routeInfo)) {
					// @ts-expect-error `routeInfo` (aka `rawRoutesInfo[i]!`) is not tracked by TS.
					routeInfo[key] = value;
					return;
				}

				// @ts-expect-error `routeInfo` (aka `rawRoutesInfo[i]!`) is not tracked by TS.
				const prevValueForKey = routeInfo[key];

				if (Array.isArray(prevValueForKey) && Array.isArray(value)) {
					prevValueForKey.splice(0, prevValueForKey.length);

					prevValueForKey.push(...value);
				}
			});
		}

		const sorter = <T extends { order: number } | undefined>(val1: T, val2: T) => {
			if (!val1) return -1;
			if (!val2) return 1;

			return val1.order - val2.order;
		};

		return (rawRoutesInfo as unknown as EnhancedRouteInfo<T>[]).sort(sorter);
	};

	const convertedRoutes = executeConvertion(topLevelRawRoutesInfo);

	convertedRoutes.forEach((convertedRoute) => {
		// @ts-expect-error untyped temporary mark
		delete convertedRoute[convertedMark];

		convertedRoute.children?.forEach((childRoute) => {
			if (!Array.isArray(childRoute.parents)) {
				childRoute.parents = [];
			}

			childRoute.parents.push(convertedRoute);
		});
	});

	if (!options?.childrenInTopLevel) {
		return convertedRoutes.filter((r) => r.parents === undefined);
	}

	return convertedRoutes;
}

export function findDeepRoute<T extends EnhancedRouteInfo>(routesInfo: T[], routeToFind: string): T | undefined {
	for (const routeInfo of routesInfo) {
		if (routeInfo.route === routeToFind) {
			return routeInfo;
		}

		if (routeInfo.children.length) {
			// @ts-expect-error TS is confused about T and expected T
			return findDeepRoute(routeInfo.children, routeToFind);
		}
	}

	return undefined;
}
